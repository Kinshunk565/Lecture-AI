import pandas as pd 
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np 
import joblib 
import requests
import os
import sys
import io
import warnings
import logging

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Suppress Hugging Face, sentence-transformers, and tqdm verbose logs
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["HF_HUB_VERBOSITY"] = "error"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
warnings.filterwarnings("ignore")

logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logger = logging.getLogger("process_incoming")

# Cached local sentence transformer model
_st_model = None

def get_local_embedding_model():
    global _st_model
    if _st_model is None:
        from transformers.utils import logging as hf_logging
        from huggingface_hub.utils import logging as hf_hub_logging
        hf_logging.disable_progress_bar()
        hf_logging.set_verbosity_error()
        hf_hub_logging.set_verbosity_error()

        from sentence_transformers import SentenceTransformer
        try:
            _st_model = SentenceTransformer('BAAI/bge-m3', local_files_only=True)
        except Exception:
            _st_model = SentenceTransformer('BAAI/bge-m3')
    return _st_model

def is_low_memory_env() -> bool:
    """Check if running in a memory-constrained container like Render Free tier (<1.5GB RAM)."""
    if os.environ.get("USE_LEXICAL_SEARCH", "").lower() in ("1", "true", "yes"):
        return True
    if os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_API_KEY"):
        return False
    for limit_file in ("/sys/fs/cgroup/memory/memory.limit_in_bytes", "/sys/fs/cgroup/memory.max"):
        if os.path.exists(limit_file):
            try:
                with open(limit_file, "r") as f:
                    content = f.read().strip()
                    if content and content != "max":
                        if int(content) < 1.8 * 1024 * 1024 * 1024:
                            return True
            except Exception:
                pass
    return False


def create_embedding(text_list):
    # Try Ollama service first if running
    try:
        r = requests.post("http://localhost:11434/api/embed", json={
            "model": "bge-m3",
            "input": text_list
        }, timeout=2)
        if r.status_code == 200:
            return r.json()["embeddings"]
    except requests.exceptions.RequestException:
        pass

    # Try Hugging Face Inference API if HF_TOKEN or HUGGINGFACE_API_KEY is available
    hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_API_KEY")
    if hf_token:
        try:
            r = requests.post(
                "https://router.huggingface.co/hf-inference/models/BAAI/bge-m3",
                headers={"Authorization": f"Bearer {hf_token}"},
                json={"inputs": text_list, "options": {"wait_for_model": True}},
                timeout=15
            )
            if r.status_code == 200:
                res = r.json()
                if isinstance(res, list) and len(res) > 0:
                    return res
        except Exception as e:
            logger.warning(f"HF Inference API embedding failed, falling back to local: {e}")

    # Guard: On low-memory cloud hosts (like Render Free 512MB), prevent downloading 2.2GB model
    if is_low_memory_env():
        raise MemoryError("Low-memory environment detected. Using fast lexical search fallback.")

    # Fallback to local SentenceTransformer (bge-m3)
    try:
        model = get_local_embedding_model()
        embeddings = model.encode(text_list, show_progress_bar=False)
        return embeddings.tolist()
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise RuntimeError(f"Error generating embedding: {e}")

# Helper to load .env or .env.example file if present
def load_env(env_paths=(".env", ".env.example")):
    for path in env_paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip("'\"")
                        if key and key not in os.environ and val and not val.startswith("your_"):
                            os.environ[key] = val

load_env()

import time

# ==========================================
# Gemini API inference
# ==========================================
# Best free-tier model:
# - 'gemini-3.6-flash' (Recommended): Current high-performance, fast model with high free tier limits
def gemini_inference(prompt, model=None, retries=3):
    if model is None:
        model = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        if __name__ == "__main__":
            api_key = input("Enter your Gemini API key (or set GEMINI_API_KEY in .env): ").strip()
        if not api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY in your environment or in a .env file.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "maxOutputTokens": 4096,
            "temperature": 0.4
        }
    }

    for attempt in range(retries):
        try:
            r = requests.post(url, headers=headers, json=payload, timeout=120)
            if r.status_code in (503, 429) and attempt < retries - 1:
                wait_time = (attempt + 1) * 2
                time.sleep(wait_time)
                continue

            if r.status_code != 200:
                error_msg = r.text
                try:
                    err_json = r.json()
                    error_msg = err_json.get("error", {}).get("message", r.text)
                except Exception:
                    pass
                raise RuntimeError(f"Gemini API error (HTTP {r.status_code}): {error_msg}")

            data = r.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return ""

            parts = candidates[0].get("content", {}).get("parts", [])
            text = "".join(p.get("text", "") for p in parts if "text" in p)
            return text
        except requests.exceptions.RequestException as e:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            raise RuntimeError(f"Network error connecting to Gemini API: {e}")


def lexical_search(query: str, df, top_k: int = 5):
    """Fast, memory-efficient lexical TF-IDF retrieval fallback when dense embeddings cannot load."""
    from sklearn.feature_extraction.text import TfidfVectorizer
    corpus = (df['title'].astype(str) + " " + df['text'].astype(str)).tolist()
    vec = TfidfVectorizer(ngram_range=(1, 2), stop_words='english', max_features=8000)
    tfidf_matrix = vec.fit_transform(corpus)
    query_vec = vec.transform([query])
    sims = cosine_similarity(tfidf_matrix, query_vec).flatten()
    max_indx = sims.argsort()[::-1][0:top_k]
    scores = sims[max_indx]
    return df.iloc[max_indx], scores


def rag_query(question, df, top_k=5):
    """Core RAG query function: embed question, find similar chunks, call Gemini.
    Falls back gracefully to lexical search if local embeddings cannot load due to memory."""
    try:
        question_embedding = create_embedding([question])[0]
        similarities = cosine_similarity(np.vstack(df['embedding']), [question_embedding]).flatten()
        max_indx = similarities.argsort()[::-1][0:top_k]
        scores = similarities[max_indx]
        result_df = df.iloc[max_indx]
    except Exception as e:
        logger.warning(f"Dense embedding search failed ({e}); falling back to fast lexical search.")
        result_df, scores = lexical_search(question, df, top_k=top_k)

    prompt = f'''You are the Senior AI Teaching Assistant for the Sigma Web Development Course taught by CodeWithHarry.
A student asked the following question:
"{question}"

Here are the most relevant lecture transcript chunks with video numbers, titles, start/end timestamps in seconds, and subtitle text:
{result_df[["title", "number", "start", "end", "text"]].to_json(orient="records")}
---------------------------------
CRITICAL INSTRUCTIONS FOR YOUR RESPONSE:
1. Provide a comprehensive, in-depth, and thorough explanation that completely answers the student's question. Do NOT give brief or shallow 1-2 sentence replies.
2. Explain the underlying concepts from first principles: explain why the technology works the way it does, how browsers interpret it, and real-world web engineering context.
3. Provide complete, clean, syntax-highlighted code snippets with helpful comments whenever applicable.
4. Cite the exact video numbers and timestamps where the instructor discusses these concepts (e.g. "In Video 2 at [04:15]...").
5. Include developer best practices, common beginner pitfalls to avoid, and practical debugging tips.
6. Use clean Markdown formatting with clear section headings (###), bulleted lists, bold key concepts, and formatted code blocks.
7. If the question is completely unrelated to web development or this curriculum, guide them back to course topics.
'''
    answer = gemini_inference(prompt)
    sources = []
    for i, (idx, row) in enumerate(result_df.iterrows()):
        sources.append({
            "title": row["title"],
            "number": str(row["number"]),
            "start": float(row["start"]),
            "end": float(row["end"]),
            "text": row["text"],
            "similarity": float(scores[i])
        })
    return answer, sources


if __name__ == "__main__":
    if not os.path.exists('embeddings.joblib'):
        print("Error: 'embeddings.joblib' file not found. Please run preprocess_json.py first.")
        sys.exit(1)

    print("Loading embeddings dataset...")
    df = joblib.load('embeddings.joblib')

    incoming_query = input("Ask a Question: ").strip()
    if not incoming_query:
        print("No question entered. Exiting.")
        sys.exit(0)

    print(f"Generating query embedding for: '{incoming_query}'...")

    answer, sources = rag_query(incoming_query, df)

    print("\n--- Answer ---")
    print(answer)

    with open("response.txt", "w", encoding="utf-8") as f:
        f.write(answer)