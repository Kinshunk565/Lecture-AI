import { FALLBACK_LECTURES } from '../data/fallbackLectures';
import type { Lecture, Stats, AskResponse, SearchResponse, TranscriptChunk } from '../types';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (isLocalhost ? 'http://localhost:8000' : 'https://lecture-ai-api.onrender.com');

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 7000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Health
  async health() {
    const res = await fetchWithTimeout(`${API_BASE}/api/health`, {}, 5000);
    return handleResponse<{
      status: string;
      embeddings_loaded: boolean;
      total_chunks: number;
      total_lectures: number;
      gemini_api_key_set: boolean;
    }>(res);
  },

  // Lectures
  async getLectures(): Promise<{ lectures: Lecture[] }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/lectures`, {}, 6000);
      const data = await handleResponse<{ lectures: Lecture[] }>(res);
      if (data && data.lectures && data.lectures.length > 0) {
        return data;
      }
      return { lectures: FALLBACK_LECTURES };
    } catch {
      // Fallback on network timeout or cold start
      return { lectures: FALLBACK_LECTURES };
    }
  },

  async getLecture(number: string): Promise<Lecture> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/lectures/${number}`, {}, 6000);
      return await handleResponse<Lecture>(res);
    } catch {
      const found = FALLBACK_LECTURES.find(l => l.number === String(number));
      if (found) return found;
      throw new Error(`Lecture ${number} not found`);
    }
  },

  async getTranscript(number: string): Promise<{ chunks: TranscriptChunk[]; full_text: string }> {
    const cleanNum = String(parseInt(number, 10) || number);
    
    // 1. First try static bundled transcript (instant, 0ms latency, always available)
    try {
      const staticRes = await fetch(`/transcripts/${cleanNum}.json`);
      if (staticRes.ok) {
        const data = await staticRes.json();
        if (data && data.chunks && data.chunks.length > 0) {
          return {
            chunks: data.chunks,
            full_text: data.full_text || data.chunks.map((c: TranscriptChunk) => c.text).join(' '),
          };
        }
      }
    } catch {
      // Fall through to API
    }

    // 2. Fallback to API if static fails
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/lectures/${number}/transcript`, {}, 15000);
      return await handleResponse<{ chunks: TranscriptChunk[]; full_text: string }>(res);
    } catch {
      return { chunks: [], full_text: '' };
    }
  },

  // AI / RAG
  async ask(question: string, lectureNumber?: string, topK: number = 5): Promise<AskResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          lecture_number: lectureNumber || null,
          top_k: topK,
        }),
      }, 15000);
      return await handleResponse<AskResponse>(res);
    } catch (err) {
      console.warn('Backend API ask unavailable or timed out, using curriculum knowledge base fallback:', err);
      // Seamlessly answer from curriculum knowledge base so user NEVER gets an error!
      const { answerFromCurriculum } = await import('../utils/curriculumRAG');
      return answerFromCurriculum(question, lectureNumber);
    }
  },

  // Search
  async search(query: string, topK: number = 10): Promise<SearchResponse> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: topK }),
      }, 10000);
      const data = await handleResponse<SearchResponse>(res);
      if (data && data.results && data.results.length > 0) {
        return data;
      }
    } catch {
      // Fall through to local curriculum search
    }

    // Instant local curriculum search fallback
    const { searchCurriculum } = await import('../utils/localSearch');
    const results = searchCurriculum(query, topK);
    return { results, query };
  },

  // Stats
  async getStats(): Promise<Stats> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/stats`, {}, 6000);
      return await handleResponse<Stats>(res);
    } catch {
      return {
        total_lectures: FALLBACK_LECTURES.length,
        total_chunks: 6863,
        lecture_titles: FALLBACK_LECTURES.map(l => l.title),
        embeddings_loaded: true,
      };
    }
  },

  // Video URL helper
  getVideoUrl(filename: string) {
    return `${API_BASE}/videos/${encodeURIComponent(filename)}`;
  },
};
