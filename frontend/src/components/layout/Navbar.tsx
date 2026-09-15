import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isLanding) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-[var(--color-primary)] no-underline">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">LectureAI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">Features</a>
          <a href="#how-it-works" className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">How it Works</a>
          <a href="#tech-stack" className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">Tech Stack</a>
          <Link to="/dashboard" className="btn-primary text-sm">
            Open App
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--color-secondary)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 pb-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <a href="#features" className="text-sm text-[var(--color-secondary)] py-2 no-underline" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-sm text-[var(--color-secondary)] py-2 no-underline" onClick={() => setMobileOpen(false)}>How it Works</a>
            <a href="#tech-stack" className="text-sm text-[var(--color-secondary)] py-2 no-underline" onClick={() => setMobileOpen(false)}>Tech Stack</a>
            <Link to="/dashboard" className="btn-primary text-sm w-fit" onClick={() => setMobileOpen(false)}>
              Open App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
