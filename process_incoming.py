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

    # Fallback to local SentenceTransformer (bge-m3)
    try:
        model = get_local_embedding_model()
        embeddings = model.encode(text_list, show_progress_bar=False)
        return embeddings.tolist()
    except Exception as e:
        print(f"\nError generating embedding: {e}")
        sys.exit(1)

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
        ]
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


def rag_query(question, df, top_k=5):
    """Core RAG query function: embed question, find similar chunks, call Gemini.
    Returns (answer_text, sources_list)."""
    question_embedding = create_embedding([question])[0]
    similarities = cosine_similarity(np.vstack(df['embedding']), [question_embedding]).flatten()
    max_indx = similarities.argsort()[::-1][0:top_k]
    scores = similarities[max_indx]
    result_df = df.loc[max_indx]

    prompt = f'''I am teaching web development in my Sigma web development course. Here are video subtitle chunks containing video title, video number, start time in seconds, end time in seconds, the text at that time:

{result_df[["title", "number", "start", "end", "text"]].to_json(orient="records")}
---------------------------------
"{question}"
User asked this question related to the video chunks, you have to answer in a human way (dont mention the above format, its just for you) where and how much content is taught in which video (in which video and at what timestamp) and guide the user to go to that particular video. If user asks unrelated question, tell him that you can only answer questions related to the course
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