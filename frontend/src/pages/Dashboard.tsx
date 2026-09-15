import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Library, FileText, MessageSquare, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { Stats, Lecture } from '../types';
import { getGreeting } from '../utils/formatTime';
import StatsCard from '../components/StatsCard';
import LectureCard from '../components/LectureCard';
import LoadingState from '../components/LoadingState';
import { useHistory } from '../hooks/useHistory';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { history } = useHistory();

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, lecturesRes] = await Promise.all([
          api.getStats(),
          api.getLectures(),
        ]);
        setStats(statsRes);
        setLectures(lecturesRes.lectures);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend. Is the API server running?');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-error-light)] flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-2">Unable to connect</h2>
          <p className="text-sm text-[var(--color-secondary)] mb-6">{error}</p>
          <p className="text-xs text-[var(--color-secondary)]">
            Make sure the backend API is running:<br />
            <code className="bg-[var(--color-background)] px-2 py-1 rounded text-xs mt-2 inline-block">python api.py</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
          {getGreeting()}, Student
        </h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">Continue learning from your lecture library.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Lectures"
          value={stats?.total_lectures ?? '—'}
          icon={<Library size={18} />}
        />
        <StatsCard
          label="Indexed Content"
          value={stats?.total_chunks ? `${stats.total_chunks.toLocaleString()} chunks` : '—'}
          icon={<FileText size={18} />}
        />
        <StatsCard
          label="Questions Asked"
          value={history.length || '—'}
          icon={<MessageSquare size={18} />}
        />
        <StatsCard
          label="Learning Time"
          value="—"
          icon={<Clock size={18} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link to="/search" className="card p-5 flex items-center gap-4 group no-underline">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-accent)] transition-colors">
            <Sparkles size={18} className="text-[var(--color-accent)] group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Search Lectures</p>
            <p className="text-xs text-[var(--color-secondary)]">Semantic search across all your lectures</p>
          </div>
          <ArrowRight size={16} className="text-[var(--color-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
        </Link>
        <Link to="/lectures" className="card p-5 flex items-center gap-4 group no-underline">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-accent)] transition-colors">
            <Library size={18} className="text-[var(--color-accent)] group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--color-primary)]">Browse Lectures</p>
            <p className="text-xs text-[var(--color-secondary)]">View all {stats?.total_lectures ?? ''} indexed lectures</p>
          </div>
          <ArrowRight size={16} className="text-[var(--color-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
        </Link>
      </div>

      {/* Recent Lectures */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--color-primary)]">Lecture Library</h2>
          <Link to="/lectures" className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] no-underline">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.slice(0, 6).map(lecture => (
            <LectureCard key={lecture.number} lecture={lecture} />
          ))}
        </div>
      </div>
    </div>
  );
}
