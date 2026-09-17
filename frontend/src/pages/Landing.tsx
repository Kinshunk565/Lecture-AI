import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Sparkles,
  ListVideo,
  Code2,
  BrainCircuit,
  Network,
  FileDown,
  Layers,
  ExternalLink,
} from 'lucide-react';

import Footer from '../components/layout/Footer';
import InteractiveHeroDemo from '../components/InteractiveHeroDemo';
import ImportVideoModal from '../components/ImportVideoModal';

const features = [
  {
    icon: ListVideo,
    title: 'Full Course & Playlist Ingestion',
    desc: 'Paste any YouTube playlist link to automatically generate sequential lessons (Lesson 1..N) with progress tracking and course navigation.',
    badge: 'Course Engine',
  },
  {
    icon: Code2,
    title: 'Live In-Browser Code Playground',
    desc: 'Interactive HTML, CSS, and JS sandbox with instant iframe live preview, virtual console, and 1-click loading of lecture code blueprints.',
    badge: 'Live Sandbox',
  },
  {
    icon: BrainCircuit,
    title: 'Active Recall Quizzes & Flashcards',
    desc: 'Test your understanding with instant-feedback multiple choice quizzes and Anki-style 3D flip flashcards featuring spaced repetition.',
    badge: 'Retention',
  },
  {
    icon: Network,
    title: 'Interactive Concept Mind-Map',
    desc: 'Visual SVG knowledge graph mapping course concepts, code structures, and traps. Clicking any node jumps the video to that exact moment.',
    badge: 'Knowledge Graph',
  },
  {
    icon: FileDown,
    title: 'Master Course Syllabus & PDF Guides',
    desc: 'Download publication-grade Master Course Syllabuses and Chapter Study Guides with vector formatting and two-pass page numbering.',
    badge: 'Export Engine',
  },
  {
    icon: Sparkles,
    title: 'Cross-Course Semantic RAG Chat',
    desc: 'Ask questions with scope toggling between [This Video] and [Full Course] to synthesize cross-lecture answers with exact timestamp citations.',
    badge: 'Gemini + BGE-M3',
  },
];

const steps = [
  {
    num: '01',
    title: 'Ingest & Transcribe',
    desc: 'Paste any YouTube playlist or video. Speech audio is processed with Whisper, generating millisecond-accurate transcripts.',
    icon: ListVideo,
  },
  {
    num: '02',
    title: 'Vectorize & Chunk',
    desc: 'Transcripts are segmented into 30–60s semantic blocks and indexed using BAAI/bge-m3 dense 1024-dimensional embeddings.',
    icon: Search,
  },
  {
    num: '03',
    title: 'Grounded RAG Reasoning',
    desc: 'Google Gemini synthesizes context-grounded answers citing exact video timestamps with zero hallucinations.',
    icon: Sparkles,
  },
  {
    num: '04',
    title: 'Interactive Mastery',
    desc: 'Code live in the playground, take quizzes, flip flashcards, tag timestamped personal notes, and export master PDFs.',
    icon: Code2,
  },
];

const techStack = [
  { category: 'Generative AI', tech: 'Google Gemini', desc: 'Grounded teaching assistant & synthesis' },
  { category: 'Speech-to-Text', tech: 'OpenAI Whisper', desc: 'Word-level timestamped transcription' },
  { category: 'Embeddings', tech: 'BAAI/bge-m3', desc: '1024-dim dense semantic vector model' },
  { category: 'Vector Search', tech: 'Cosine Similarity', desc: 'Sub-10ms in-memory Scikit-Learn index' },
  { category: 'Backend API', tech: 'Python + FastAPI', desc: 'Asynchronous streaming & REST server' },
  { category: 'Frontend', tech: 'React 19 + Vite 8', desc: 'Fast concurrent UI & TypeScript runtime' },
  { category: 'Styling', tech: 'Tailwind CSS v4', desc: 'Modern responsive dark-mode design system' },
  { category: 'PDF Engine', tech: 'jsPDF Vector', desc: 'Client-side multi-page syllabus generator' },
  { category: 'Hosting', tech: 'Vercel + Render', desc: 'Continuous deployment with global edge CDN' },
];

export default function Landing() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-xs font-semibold mb-6 border border-[var(--color-accent)]/20 shadow-sm">
              <Layers size={13} />
              <span>Full Course Playlists & Interactive Workbench Now Live</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] tracking-tight leading-[1.1] mb-6">
              Turn video playlists into <br className="hidden sm:block" />
              <span className="text-[var(--color-accent)]">interactive AI workstations.</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-secondary)] leading-relaxed max-w-2xl mx-auto mb-8">
              LectureAI transforms multi-video YouTube playlists and courses into an active learning studio. Ask cross-lecture questions with timestamp citations, code live in the sandbox, take quizzes, and export master course syllabuses.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/lectures" className="btn-primary text-sm sm:text-base px-6 py-3 no-underline shadow-md">
                Explore Full Courses <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="btn-accent text-sm sm:text-base px-6 py-3 inline-flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <ListVideo size={16} /> Import Course or Playlist
              </button>
              <Link to="/search" className="btn-secondary text-sm sm:text-base px-6 py-3 no-underline">
                Search Knowledge Base
              </Link>
            </div>
          </div>

          {/* Live Interactive Video & AI Demo */}
          <div className="mt-6">
            <InteractiveHeroDemo />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-title mb-3 block">Features</span>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">
              Built for deep, active learning
            </h2>
            <p className="text-sm text-[var(--color-secondary)] max-w-xl mx-auto mt-2">
              Everything you need to master technical lecture series—from first-principles code sandboxes to spaced repetition testing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card p-6 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all flex flex-col justify-between bg-[var(--color-background)] group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <f.icon size={20} className="text-[var(--color-accent)]" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface)] text-[var(--color-secondary)] text-[10px] font-semibold border border-[var(--color-border)]">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-secondary)] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-title mb-3 block">Process</span>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">
              How LectureAI works
            </h2>
            <p className="text-sm text-[var(--color-secondary)] max-w-lg mx-auto mt-2">
              From raw video stream to indexed semantic embeddings and interactive practice.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="card p-6 border border-[var(--color-border)] bg-[var(--color-surface)] relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-extrabold text-[var(--color-accent)]/20 block mb-2 font-mono">
                    {s.num}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center mb-4">
                    <s.icon size={18} className="text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" className="py-20 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-title mb-3 block">Technology</span>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">
              Production Architecture & Tech Stack
            </h2>
            <p className="text-sm text-[var(--color-secondary)] max-w-xl mx-auto mt-2">
              Engineered with modern AI models, vector retrieval, and concurrent frontend frameworks.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((t) => (
              <div key={t.category} className="card p-5 border border-[var(--color-border)] bg-[var(--color-background)]">
                <span className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-wider block">
                  {t.category}
                </span>
                <p className="text-sm font-bold text-[var(--color-primary)] mt-1">{t.tech}</p>
                <p className="text-xs text-[var(--color-secondary)] mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[var(--color-primary)]">
                Explore Detailed Architecture Guide
              </h4>
              <p className="text-[11px] text-[var(--color-secondary)]">
                Read the exhaustive breakdown of our models, vector database, and client engines in TECH_STACK.md.
              </p>
            </div>
            <a
              href="https://github.com/Kinshunk565/Lecture-AI/blob/main/TECH_STACK.md"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 no-underline shrink-0"
            >
              <span>View TECH_STACK.md</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-title mb-3 block">Architecture</span>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">RAG Pipeline</h2>
          </div>
          <div className="card p-6 md:p-8">
            <div className="flex flex-col items-center gap-3">
              {[
                { label: 'Video Lecture', icon: '🎬' },
                { label: 'Whisper Transcription', icon: '🎙️' },
                { label: 'Timestamped Transcript', icon: '📝' },
                { label: 'Chunking', icon: '✂️' },
                { label: 'BGE-M3 Embeddings', icon: '🧮' },
                { label: 'Cosine Similarity Search', icon: '🔍' },
                { label: 'Top-K Context Retrieval', icon: '📋' },
                { label: 'Gemini Answer Generation', icon: '✨' },
                { label: 'Answer + Timestamped Sources', icon: '🎯' },
              ].map((step, i, arr) => (
                <div key={step.label} className="w-full max-w-sm">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]">
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-sm font-medium text-[var(--color-primary)]">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-px h-4 bg-[var(--color-border)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight mb-4">
            Start learning smarter
          </h2>
          <p className="text-[var(--color-secondary)] mb-8">
            Explore your lecture library and ask AI-powered questions with timestamp precision.
          </p>
          <Link to="/dashboard" className="btn-primary text-base px-8 py-3">
            Open LectureAI <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />

      <ImportVideoModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
