import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">LectureAI</span>
            </div>
            <p className="text-sm text-[var(--color-secondary)] leading-relaxed">
              AI-powered lecture intelligence. Transform recorded lectures into searchable knowledge.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Built with</h4>
            <div className="flex flex-wrap gap-2">
              {['Whisper', 'BGE-M3', 'Gemini', 'Python', 'React', 'FastAPI'].map(tech => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-background)] text-[var(--color-secondary)] border border-[var(--color-border)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-secondary)]">
            © {new Date().getFullYear()} LectureAI
          </p>
          <p className="text-xs text-[var(--color-secondary)] opacity-60">
            RAG-based AI Teaching Assistant
          </p>
        </div>
      </div>
    </footer>
  );
}
