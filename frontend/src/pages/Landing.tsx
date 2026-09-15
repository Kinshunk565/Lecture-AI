import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, Clock, CheckCircle, Mic, Brain, Play } from 'lucide-react';
import Footer from '../components/layout/Footer';

const features = [
  { icon: Brain, title: 'Semantic Understanding', desc: 'Find concepts based on meaning, not just keywords. BGE-M3 embeddings capture deep semantic relationships.' },
  { icon: Clock, title: 'Timestamp Precision', desc: 'Jump directly to the relevant moment in the lecture. Every answer links to exact video timestamps.' },
  { icon: CheckCircle, title: 'Grounded Answers', desc: 'Answers are generated using retrieved lecture context — no hallucinations, only course content.' },
  { icon: Search, title: 'Faster Learning', desc: 'Spend less time scrubbing through videos and more time understanding concepts.' },
];

const steps = [
  { num: '01', title: 'Understand', desc: 'Lecture audio is transcribed using Whisper while preserving precise timestamps for every segment.', icon: Mic },
  { num: '02', title: 'Retrieve', desc: 'Semantic embeddings (BGE-M3) identify the most relevant lecture segments for your question.', icon: Search },
  { num: '03', title: 'Answer', desc: 'Gemini generates a contextual, grounded answer using the retrieved lecture content.', icon: Brain },
  { num: '04', title: 'Verify', desc: 'Jump directly to the exact timestamp where the concept was discussed in the video.', icon: Play },
];

const techStack = [
  { category: 'LLM', tech: 'Google Gemini', desc: 'Answer generation' },
  { category: 'Speech', tech: 'OpenAI Whisper', desc: 'Audio transcription' },
  { category: 'Embeddings', tech: 'BAAI/bge-m3', desc: 'Semantic vectors' },
  { category: 'Retrieval', tech: 'Cosine Similarity', desc: 'Vector search' },
  { category: 'Backend', tech: 'Python + FastAPI', desc: 'API server' },
  { category: 'Frontend', tech: 'React + TypeScript', desc: 'UI framework' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-xs font-medium mb-6">
              <BookOpen size={12} />
              AI-powered lecture intelligence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] tracking-tight leading-[1.1] mb-6">
              Ask your lectures<br />anything.
            </h1>
            <p className="text-lg text-[var(--color-secondary)] leading-relaxed max-w-xl mx-auto mb-8">
              LectureAI transforms recorded lectures into an intelligent, searchable knowledge base. Ask questions in natural language and jump directly to the moment where the concept was explained.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/lectures" className="btn-primary text-base px-6 py-3">
                Explore Lectures <ArrowRight size={16} />
              </Link>
              <Link to="/search" className="btn-secondary text-base px-6 py-3">
                Search Lectures
              </Link>
            </div>
          </div>

          {/* Product Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="card p-6 md:p-8 bg-[var(--color-surface)]">
              <div className="bg-[var(--color-background)] rounded-lg p-5 border border-[var(--color-border)]">
                {/* Fake search bar */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] mb-5">
                  <Search size={16} className="text-[var(--color-secondary)]" />
                  <span className="text-sm text-[var(--color-primary)]">What is CSS and how does it work?</span>
                </div>

                {/* Fake answer */}
                <div className="mb-5">
                  <span className="section-title mb-2 block">Answer</span>
                  <p className="text-sm text-[var(--color-primary)] leading-relaxed">
                    CSS (Cascading Style Sheets) is responsible for styling web pages. While HTML creates the skeleton/structure of a website, CSS handles the visual presentation — colors, layouts, fonts, and designs. CSS uses selectors to target HTML elements and applies declarations (property-value pairs) to style them.
                  </p>
                </div>

                {/* Fake sources */}
                <span className="section-title mb-3 block">Sources from your lecture</span>
                <div className="space-y-2">
                  {[
                    { time: '0:21', title: 'CSS stands for Cascading Style Sheets' },
                    { time: '1:31', title: 'HTML vs CSS — skeleton vs styling' },
                    { time: '4:44', title: 'CSS selectors and declarations explained' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <div className="w-8 h-8 rounded-md bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0">
                        <Play size={12} className="text-[var(--color-accent)] ml-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--color-primary)] truncate">{s.title}</p>
                        <p className="text-[10px] text-[var(--color-secondary)]">Video 14 · Introduction to CSS</p>
                      </div>
                      <span className="text-xs font-mono text-[var(--color-accent)]">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-title mb-3 block">Features</span>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">Built for learning</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-5">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-[var(--color-accent)]" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{f.desc}</p>
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
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">How LectureAI works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(s => (
              <div key={s.num} className="relative">
                <span className="text-5xl font-bold text-[var(--color-border)] absolute -top-2 -left-1">{s.num}</span>
                <div className="pt-10">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center mb-4">
                    <s.icon size={18} className="text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-2">{s.title}</h3>
                  <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" className="py-20 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-title mb-3 block">Technology</span>
            <h2 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">Tech Stack</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map(t => (
              <div key={t.category} className="card p-5">
                <span className="section-title">{t.category}</span>
                <p className="text-base font-semibold text-[var(--color-primary)] mt-1">{t.tech}</p>
                <p className="text-xs text-[var(--color-secondary)] mt-0.5">{t.desc}</p>
              </div>
            ))}
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
    </div>
  );
}
