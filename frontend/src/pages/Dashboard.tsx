import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Library,
  FileText,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ListVideo,
  Play,
  Code2,
  BrainCircuit,
  Network,
} from 'lucide-react';

import { api } from '../services/api';
import type { Stats, Lecture } from '../types';
import { FALLBACK_LECTURES } from '../data/fallbackLectures';
import { getGreeting } from '../utils/formatTime';
import StatsCard from '../components/StatsCard';
import LectureCard from '../components/LectureCard';
import { useHistory } from '../hooks/useHistory';
import { courseStorage } from '../services/courseStorage';

const INITIAL_STATS: Stats = {
  total_lectures: 18,
  total_chunks: 6863,
  lecture_titles: FALLBACK_LECTURES.map((l) => l.title),
  embeddings_loaded: true,
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [lectures, setLectures] = useState<Lecture[]>(FALLBACK_LECTURES);
  const { history } = useHistory();

  const sigmaNums = Array.from({ length: 18 }, (_, i) => String(i + 1));
  const sigmaProgress = courseStorage.getCourseProgress(sigmaNums);
  const nextLessonNum = sigmaNums.find((n) => !courseStorage.isLessonCompleted(n)) || '1';
  const totalCompletedCount = courseStorage.getCompletedLessons().length;

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, lecturesRes] = await Promise.all([
          api.getStats(),
          api.getLectures(),
        ]);
        if (statsRes) setStats(statsRes);
        if (lecturesRes && lecturesRes.lectures.length > 0) {
          setLectures(lecturesRes.lectures);
        }
      } catch {
        // Keep fallback data silently
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
          {getGreeting()}, Student
        </h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">
          Welcome to your personal AI lecture learning studio.
        </p>
      </div>

      {/* Course In-Progress Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-accent)]/15 via-[var(--color-accent)]/5 to-transparent border border-[var(--color-accent)]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
              <ListVideo size={12} /> Active Course
            </span>
            <span className="text-xs text-[var(--color-secondary)]">CodeWithHarry · 18 Lessons</span>
          </div>
          <h2 className="text-lg font-bold text-[var(--color-primary)]">
            Sigma Web Development Course
          </h2>
          <div className="flex items-center gap-3 text-xs text-[var(--color-secondary)]">
            <span className="font-mono text-[var(--color-accent)] font-semibold">
              {sigmaProgress.completed} of 18 completed ({sigmaProgress.percentage}%)
            </span>
            <div className="w-32 h-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                style={{ width: `${sigmaProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <Link
          to={`/lectures/${nextLessonNum}`}
          className="btn-accent text-xs font-semibold py-2.5 px-5 rounded-xl inline-flex items-center gap-2 no-underline shadow-md shrink-0"
        >
          <Play size={14} className="fill-white" />
          {sigmaProgress.completed > 0 ? `Resume Lesson ${nextLessonNum}` : 'Start Lesson 1'}
        </Link>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Lectures"
          value={stats?.total_lectures ?? '—'}
          icon={<Library size={18} />}
        />
        <StatsCard
          label="Indexed Segments"
          value={stats?.total_chunks ? `${stats.total_chunks.toLocaleString()}` : '—'}
          icon={<FileText size={18} />}
        />
        <StatsCard
          label="Questions Asked"
          value={history.length || '—'}
          icon={<MessageSquare size={18} />}
        />
        <StatsCard
          label="Lessons Mastered"
          value={totalCompletedCount > 0 ? `${totalCompletedCount} lessons` : 'In progress'}
          icon={<CheckCircle2 size={18} className="text-emerald-400" />}
        />
      </div>

      {/* Interactive Workbench Quick Access */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-3">
          Interactive Learning Tools
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/lectures/1"
            className="card p-4 flex items-center gap-3 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all no-underline group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Code2 size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)]">Code Playground</p>
              <p className="text-[11px] text-[var(--color-secondary)]">Live HTML/CSS/JS sandbox</p>
            </div>
          </Link>

          <Link
            to="/lectures/1"
            className="card p-4 flex items-center gap-3 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all no-underline group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BrainCircuit size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)]">Quizzes & Flashcards</p>
              <p className="text-[11px] text-[var(--color-secondary)]">Active recall & 3D cards</p>
            </div>
          </Link>

          <Link
            to="/lectures/1"
            className="card p-4 flex items-center gap-3 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all no-underline group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Network size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)]">Concept Mind-Map</p>
              <p className="text-[11px] text-[var(--color-secondary)]">Timestamp-linked topics</p>
            </div>
          </Link>

          <Link
            to="/search"
            className="card p-4 flex items-center gap-3 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all no-underline group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)]">Semantic Search</p>
              <p className="text-[11px] text-[var(--color-secondary)]">BGE-M3 cross-lecture RAG</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Lectures Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--color-primary)]">Lecture Series</h2>
          <Link
            to="/lectures"
            className="text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] no-underline flex items-center gap-1"
          >
            View All Courses & Playlists <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.slice(0, 6).map((lecture) => (
            <LectureCard key={lecture.number} lecture={lecture} />
          ))}
        </div>
      </div>
    </div>
  );
}

