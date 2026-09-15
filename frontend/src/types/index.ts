// ─── Lecture Types ─────────────────────────────────────────────
export interface Lecture {
  number: string;
  title: string;
  chunk_count: number;
  duration: number;
  json_file: string;
  video_file: string | null;
  indexed: boolean;
}

export interface TranscriptChunk {
  number: string;
  title: string;
  start: number;
  end: number;
  text: string;
}

// ─── AI / RAG Types ───────────────────────────────────────────
export interface Source {
  title: string;
  number: string;
  start: number;
  end: number;
  text: string;
  similarity: number;
}

export interface AskResponse {
  answer: string;
  sources: Source[];
  question: string;
}

export interface SearchResult {
  title: string;
  number: string;
  start: number;
  end: number;
  text: string;
  similarity: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
}

// ─── Stats ────────────────────────────────────────────────────
export interface Stats {
  total_lectures: number;
  total_chunks: number;
  lecture_titles: string[];
  embeddings_loaded: boolean;
}

// ─── Health ───────────────────────────────────────────────────
export interface HealthStatus {
  status: string;
  embeddings_loaded: boolean;
  total_chunks: number;
  total_lectures: number;
  gemini_api_key_set: boolean;
}

// ─── Chat / History ───────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  sources: Source[];
  lectureNumber?: string;
  lectureTitle?: string;
  timestamp: number;
}

export interface Bookmark {
  id: string;
  lectureNumber: string;
  lectureTitle: string;
  start: number;
  end: number;
  text: string;
  type: 'timestamp' | 'answer' | 'transcript';
  createdAt: number;
}
