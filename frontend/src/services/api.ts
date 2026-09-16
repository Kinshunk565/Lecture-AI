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
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/lectures/${number}/transcript`, {}, 8000);
      return await handleResponse<{ chunks: TranscriptChunk[]; full_text: string }>(res);
    } catch {
      // Return empty transcript chunks gracefully on error
      return { chunks: [], full_text: '' };
    }
  },

  // AI / RAG
  async ask(question: string, lectureNumber?: string, topK: number = 5): Promise<AskResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        lecture_number: lectureNumber || null,
        top_k: topK,
      }),
    }, 25000);
    return handleResponse<AskResponse>(res);
  },

  // Search
  async search(query: string, topK: number = 10): Promise<SearchResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    }, 12000);
    return handleResponse<SearchResponse>(res);
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
