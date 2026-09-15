const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    const res = await fetch(`${API_BASE}/api/health`);
    return handleResponse<{
      status: string;
      embeddings_loaded: boolean;
      total_chunks: number;
      total_lectures: number;
      gemini_api_key_set: boolean;
    }>(res);
  },

  // Lectures
  async getLectures() {
    const res = await fetch(`${API_BASE}/api/lectures`);
    return handleResponse<{ lectures: import('../types').Lecture[] }>(res);
  },

  async getLecture(number: string) {
    const res = await fetch(`${API_BASE}/api/lectures/${number}`);
    return handleResponse<import('../types').Lecture>(res);
  },

  async getTranscript(number: string) {
    const res = await fetch(`${API_BASE}/api/lectures/${number}/transcript`);
    return handleResponse<{ chunks: import('../types').TranscriptChunk[]; full_text: string }>(res);
  },

  // AI / RAG
  async ask(question: string, lectureNumber?: string, topK: number = 5) {
    const res = await fetch(`${API_BASE}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        lecture_number: lectureNumber || null,
        top_k: topK,
      }),
    });
    return handleResponse<import('../types').AskResponse>(res);
  },

  // Search
  async search(query: string, topK: number = 10) {
    const res = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    });
    return handleResponse<import('../types').SearchResponse>(res);
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/api/stats`);
    return handleResponse<import('../types').Stats>(res);
  },

  // Video URL helper
  getVideoUrl(filename: string) {
    return `${API_BASE}/videos/${encodeURIComponent(filename)}`;
  },
};
