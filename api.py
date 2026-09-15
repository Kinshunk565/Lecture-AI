"""
LectureAI Backend API
FastAPI server that wraps the existing RAG pipeline from process_incoming.py.
All RAG logic (embeddings, similarity search, Gemini calls) is preserved.
"""

import os
import sys
import json
import glob
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

# Ensure we can import from the project root
sys.path.insert(0, os.path.dirname(__file__))

# Suppress verbose ML library logs before importing process_incoming
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
os.environ["HF_HUB_VERBOSITY"] = "error"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import warnings
warnings.filterwarnings("ignore")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lectureai")

# Import RAG functions from existing codebase
from process_incoming import create_embedding, gemini_inference, load_env, rag_query

import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# ─── Configuration ─────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
JSONS_DIR = BASE_DIR / "jsons"
VIDEOS_DIR = BASE_DIR / "videos"
EMBEDDINGS_PATH = BASE_DIR / "embeddings.joblib"

# ─── Global state ──────────────────────────────────────────────
embeddings_df = None
lectures_cache = None


def load_lectures_metadata():
    """Read all JSON transcript files and build lecture metadata."""
    lectures = {}
    json_files = sorted(JSONS_DIR.glob("*.json"))

    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                content = json.load(f)

            chunks = content.get("chunks", [])
            if not chunks:
                continue

            # Extract metadata from first chunk
            number = chunks[0].get("number", "0")
            title = chunks[0].get("title", json_file.stem)

            # Calculate duration from last chunk
            duration = max(c.get("end", 0) for c in chunks) if chunks else 0

            # Find matching video file
            video_file = None
            for ext in [".mp4", ".mkv", ".webm", ".avi"]:
                matches = list(VIDEOS_DIR.glob(f"*{ext}"))
                for m in matches:
                    if number in m.name or title.lower() in m.name.lower():
                        video_file = m.name
                        break
                if video_file:
                    break

            lectures[number] = {
                "number": number,
                "title": title,
                "chunk_count": len(chunks),
                "duration": duration,
                "json_file": json_file.name,
                "video_file": video_file,
                "indexed": True,
            }
        except Exception as e:
            logger.warning(f"Error reading {json_file}: {e}")

    return lectures


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load embeddings and lecture metadata at startup."""
    global embeddings_df, lectures_cache

    # Load environment
    load_env()

    # Load embeddings
    if EMBEDDINGS_PATH.exists():
        logger.info("Loading embeddings dataset...")
        embeddings_df = joblib.load(str(EMBEDDINGS_PATH))
        logger.info(f"Loaded {len(embeddings_df)} embedding chunks.")
    else:
        logger.warning("embeddings.joblib not found. RAG queries will not work.")

    # Load lecture metadata
    lectures_cache = load_lectures_metadata()
    logger.info(f"Loaded metadata for {len(lectures_cache)} lectures.")

    yield  # App runs

    logger.info("Shutting down LectureAI API.")


# ─── FastAPI App ───────────────────────────────────────────────
app = FastAPI(
    title="LectureAI API",
    description="AI-powered lecture intelligence — RAG retrieval over lecture transcripts",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS for frontend (development + deployed domains)
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins] if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve video files statically
if VIDEOS_DIR.exists():
    app.mount("/videos", StaticFiles(directory=str(VIDEOS_DIR)), name="videos")


# ─── Request/Response Models ──────────────────────────────────
class AskRequest(BaseModel):
    question: str
    lecture_number: Optional[str] = None  # Filter to specific lecture
    top_k: Optional[int] = 5

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 10


# ─── Endpoints ─────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "message": "🎓 Welcome to LectureAI API",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "lectures": "/api/lectures",
            "ask": "/api/ask",
            "search": "/api/search",
            "stats": "/api/stats"
        }
    }


@app.get("/api/health")
async def health_check():
    has_api_key = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    return {
        "status": "healthy",
        "embeddings_loaded": embeddings_df is not None,
        "total_chunks": len(embeddings_df) if embeddings_df is not None else 0,
        "total_lectures": len(lectures_cache) if lectures_cache else 0,
        "gemini_api_key_set": has_api_key,
    }


@app.get("/api/lectures")
async def list_lectures():
    if not lectures_cache:
        return {"lectures": []}
    return {"lectures": list(lectures_cache.values())}


@app.get("/api/lectures/{number}")
async def get_lecture(number: str):
    if not lectures_cache or number not in lectures_cache:
        raise HTTPException(status_code=404, detail=f"Lecture {number} not found")
    return lectures_cache[number]


@app.get("/api/lectures/{number}/transcript")
async def get_transcript(number: str):
    if not lectures_cache or number not in lectures_cache:
        raise HTTPException(status_code=404, detail=f"Lecture {number} not found")

    lecture = lectures_cache[number]
    json_file = JSONS_DIR / lecture["json_file"]

    try:
        with open(json_file, "r", encoding="utf-8") as f:
            content = json.load(f)
        return {"chunks": content.get("chunks", []), "full_text": content.get("text", "")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading transcript: {str(e)}")


@app.post("/api/ask")
async def ask_question(req: AskRequest):
    if embeddings_df is None:
        raise HTTPException(status_code=503, detail="Embeddings not loaded. Please run preprocess_json.py first.")

    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # Check for API key
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Gemini API key not configured. Set GEMINI_API_KEY in your .env file.")

    try:
        # If filtering to a specific lecture
        df_to_search = embeddings_df
        if req.lecture_number:
            filtered = embeddings_df[embeddings_df["number"].astype(str) == str(req.lecture_number)]
            if len(filtered) > 0:
                df_to_search = filtered

        answer, sources = rag_query(req.question, df_to_search, top_k=req.top_k or 5)

        return {
            "answer": answer,
            "sources": sources,
            "question": req.question,
        }

    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing question: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred while processing your question.")


@app.post("/api/search")
async def search_lectures(req: SearchRequest):
    """Semantic search across all lectures — returns relevant chunks without Gemini answer."""
    if embeddings_df is None:
        raise HTTPException(status_code=503, detail="Embeddings not loaded.")

    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")

    try:
        query_embedding = create_embedding([req.query])[0]
        similarities = cosine_similarity(
            np.vstack(embeddings_df['embedding']), [query_embedding]
        ).flatten()

        top_k = min(req.top_k or 10, 20)
        max_indx = similarities.argsort()[::-1][0:top_k]
        scores = similarities[max_indx]

        results = []
        for i, idx in enumerate(max_indx):
            row = embeddings_df.iloc[idx] if idx < len(embeddings_df) else embeddings_df.loc[idx]
            results.append({
                "title": row["title"],
                "number": str(row["number"]),
                "start": float(row["start"]),
                "end": float(row["end"]),
                "text": row["text"],
                "similarity": float(scores[i]),
            })

        return {"results": results, "query": req.query}

    except Exception as e:
        logger.error(f"Error during search: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during search.")


@app.get("/api/stats")
async def get_stats():
    total_chunks = len(embeddings_df) if embeddings_df is not None else 0
    total_lectures = len(lectures_cache) if lectures_cache else 0

    # Get unique titles
    unique_titles = []
    if lectures_cache:
        unique_titles = [l["title"] for l in lectures_cache.values()]

    return {
        "total_lectures": total_lectures,
        "total_chunks": total_chunks,
        "lecture_titles": unique_titles,
        "embeddings_loaded": embeddings_df is not None,
    }


# ─── Run ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
