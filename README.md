# 🎓 LectureAI — Production-Grade RAG AI Teaching Assistant

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🌐 **Live Web Application**: [lecture-ai-seven-beta.vercel.app](https://lecture-ai-seven-beta.vercel.app)  
> ⚡ **Live API Service**: [lecture-ai-api.onrender.com](https://lecture-ai-api.onrender.com)

**LectureAI** is an end-to-end Retrieval-Augmented Generation (RAG) educational platform designed to transform long video lectures into searchable, interactive, and conversational learning experiences. 

Instead of scrubbing through hours of video, students can ask natural-language questions, receive grounded explanations with direct timestamp citations, download AI-summarized PDF study notes, and jump straight to the exact moments where concepts are explained.

---

## 🌟 Key Features

- 🎯 **Grounded AI Teaching Assistant**: Answers student queries strictly grounded in lecture transcripts using Google Gemini with direct timestamp citations to prevent hallucinations.
- 📑 **Automated Lecture PDF Summaries**: One-click generation and instant download of structured, beautifully branded A4 study guides containing executive summaries, core objectives, chronological milestones with timestamp pills, and review quiz questions.
- ⚡ **Timestamp-Synchronized Video Player**: Custom HTML5 media player featuring variable playback speeds, seek jumps, fullscreen, cloud YouTube streaming fallback, and video overlay synced to transcript timestamps.
- 🔍 **Interactive Semantic Search**: Global search powered by dense vector embeddings (`BAAI/bge-m3`) to find concepts by conceptual meaning, not just exact keywords.
- 📜 **Synchronized Transcript Viewer**: Live autoscrolling transcript with active-segment highlighting and instant one-click jump-to-time.
- ✨ **Fluid Animated Custom Cursor**: Responsive, glowing cursor providing micro-interactions and smooth trailing animation across the application.
- 📊 **Analytics & Metrics Dashboard**: System architecture inspector, corpus statistics, chunk distribution, and retrieval diagnostics.
- 🔖 **Bookmarks & History**: Save important queries, revisit past interactions, and export notes locally.
- 🎨 **Modern Dark-Mode Design**: Responsive layout with Tailwind CSS typography, micro-interactions, accessible UI components, and keyboard navigation.

---

## 🏗️ Architecture & Pipeline

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Video Lecture  │ ────► │ Whisper Audio   │ ────► │ Timestamped     │
│   (MP4/MKV)     │       │ Transcription   │       │ JSON Segments   │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Gemini LLM      │ ◄──── │ BGE-M3 Dense    │ ◄──── │ Text Chunking   │
│ Generation      │       │ Vector Encoding │       │ & Preprocessing │
└────────┬────────┘       └─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       FastAPI REST Services                         │
│  /api/lectures • /api/ask • /api/search • /api/stats • /api/videos  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Modern React + Vite + TS Frontend                   │
│   Dashboard • Interactive Player • AI Assistant • Semantic Search   │
└─────────────────────────────────────────────────────────────────────┘
```

1. **Audio Extraction**: Lectures (`videos/`) are converted to 16kHz audio using FFmpeg (`video_to_mp3.py`).
2. **Transcription**: OpenAI Whisper transcribes speech into timestamp-annotated segment chunks (`mp3_to_json.py`).
3. **Preprocessing & Chunking**: Adjacent segments are merged with sliding window context into semantically rich chunks (`preprocess_json.py`).
4. **Dense Embeddings**: `BAAI/bge-m3` produces dense 1024-dimensional semantic vectors (`embeddings.joblib`).
5. **Retrieval**: User queries are vectorized and compared against lecture embeddings using cosine similarity.
6. **Augmented Generation**: The top-$k$ most relevant context segments and timestamp boundaries are synthesized into grounded answers via Google Gemini.

---

## 📂 Project Structure

```
Lecture-AI/
├── api.py                    # FastAPI server exposing RAG endpoints & static streaming
├── process_incoming.py       # Core RAG retrieval & Gemini LLM synthesis pipeline
├── preprocess_json.py        # Chunking & sliding-window context aggregator
├── mp3_to_json.py            # Whisper speech-to-text transcription engine
├── video_to_mp3.py           # FFmpeg audio extraction utility
├── requirements.txt          # Python dependencies
├── embeddings.joblib         # Pre-computed BGE-M3 vector embeddings
├── jsons/                    # Raw and preprocessed timestamped transcripts
├── videos/                   # Video lecture repository
├── audios/                   # Extracted audio files
├── docs/                     # Project documentation & synopsis
│   └── Synopsis_RAG_Teaching_Assistant.docx
└── frontend/                 # Production React + TypeScript SPA
    ├── src/
    │   ├── components/       # VideoPlayer, AIChat, TranscriptViewer, SourceCard, CustomCursor
    │   │   └── layout/       # Sidebar, Navbar, Footer
    │   ├── pages/            # Landing, Dashboard, LectureDetail, Search, Analytics, etc.
    │   ├── services/api.ts   # Typed API client
    │   ├── hooks/            # Custom state & storage hooks
    │   ├── types/            # TypeScript data contracts
    │   └── utils/            # formatTime, generatePdfSummary (jsPDF study guides)
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+** (Python 3.13 recommended)
- **Node.js 18+** & `npm`
- **FFmpeg** (for processing new videos)
- **Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

---

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kinshunk565/Lecture-AI.git
   cd Lecture-AI
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure API Key**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.6-flash
   ```

4. **Launch FastAPI Backend**:
   ```bash
   py -3.13 -m uvicorn api:app --reload --port 8000
   ```
   *The interactive Swagger documentation will be available at `http://localhost:8000/docs`.*

---

### Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:5173`** in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and service readiness |
| `GET` | `/api/stats` | Total lectures, segments, and vector dimension metrics |
| `GET` | `/api/lectures` | List all available lectures with durations and chunk stats |
| `GET` | `/api/lectures/{id}` | Detailed lecture metadata, video path, and full transcript |
| `POST` | `/api/ask` | Query the RAG engine for a grounded answer with timestamp citations |
| `POST` | `/api/search` | Fast semantic similarity search across transcripts |
| `GET` | `/api/videos/{name}` | Stream MP4/WebM video files directly to HTML5 player |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7, jsPDF (client-side PDF generation)
- **Backend**: FastAPI, Uvicorn, Pydantic, Starlette
- **Machine Learning & NLP**:
  - `BAAI/bge-m3` (Dense multilingual embeddings)
  - `OpenAI Whisper` (High-accuracy speech transcription)
  - `Google Gemini Flash` (Grounded LLM context answering)
  - `scikit-learn` & `numpy` (Cosine similarity vector search)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
