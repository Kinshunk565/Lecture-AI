import { ExternalLink } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-6 md:p-8 max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">Configure your LectureAI experience.</p>
      </div>

      <div className="space-y-6">
        {/* Backend Status */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-4">Backend Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-secondary)]">API Server</span>
              <code className="text-xs bg-[var(--color-background)] px-2 py-1 rounded">http://localhost:8000</code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-secondary)]">Gemini Model</span>
              <code className="text-xs bg-[var(--color-background)] px-2 py-1 rounded">gemini-3.6-flash</code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-secondary)]">Embedding Model</span>
              <code className="text-xs bg-[var(--color-background)] px-2 py-1 rounded">BAAI/bge-m3</code>
            </div>
          </div>
        </div>

        {/* Data management */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-4">Local Data</h3>
          <p className="text-xs text-[var(--color-secondary)] mb-4">
            History and bookmarks are stored in your browser's local storage.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.removeItem('lectureai-history');
                localStorage.removeItem('lectureai-bookmarks');
                window.location.reload();
              }}
              className="btn-secondary text-xs"
            >
              Clear All Local Data
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-2">About LectureAI</h3>
          <p className="text-sm text-[var(--color-secondary)] leading-relaxed mb-4">
            LectureAI is a RAG-based AI Teaching Assistant that transforms recorded lectures into
            an intelligent, searchable knowledge base. Built with Whisper, BGE-M3, and Gemini.
          </p>
          <a
            href="https://github.com/Priyanshu35a/RAG-based-AI-Teaching-Assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] inline-flex items-center gap-1 no-underline"
          >
            View on GitHub <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
