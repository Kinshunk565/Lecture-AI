import { BookOpen, ExternalLink, FileCode, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--color-primary)]">LectureAI</span>
            </div>
            <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Full-stack AI lecture & course learning workstation. Convert YouTube playlists and multi-video courses into interactive, searchable studios with RAG Q&A, code sandboxes, and quizzes.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3">
              Explore & Resources
            </h4>
            <ul className="space-y-2 text-xs text-[var(--color-secondary)]">
              <li>
                <Link to="/lectures" className="hover:text-[var(--color-primary)] transition-colors no-underline">
                  Course & Playlist Library
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[var(--color-primary)] transition-colors no-underline">
                  Semantic Knowledge Search
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Kinshunk565/Lecture-AI/blob/main/TECH_STACK.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--color-primary)] transition-colors no-underline inline-flex items-center gap-1"
                >
                  <FileCode size={12} /> Tech Stack & Architecture Guide
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Kinshunk565/Lecture-AI"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--color-primary)] transition-colors no-underline inline-flex items-center gap-1"
                >
                  <Code2 size={12} /> GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3">
              Core Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'React 19',
                'TypeScript',
                'Vite 8',
                'Tailwind v4',
                'Google Gemini',
                'BAAI/bge-m3',
                'Whisper ASR',
                'Python FastAPI',
                'jsPDF Engine',
                'In-Memory Vectors',
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-background)] text-[var(--color-secondary)] border border-[var(--color-border)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--color-secondary)]">
          <p>© {new Date().getFullYear()} LectureAI · Open-Source Educational RAG Workstation</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Kinshunk565/Lecture-AI"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              MIT License
            </a>
            <span>·</span>
            <a
              href="https://lecture-ai-api.onrender.com/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
            >
              API Swagger Docs <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

