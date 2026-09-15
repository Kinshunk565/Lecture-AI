import { useEffect, useState } from 'react';
import { Library, FileText, MessageSquare, BarChart3, Mic, Brain, Cpu, Search } from 'lucide-react';
import { api } from '../services/api';
import type { Stats } from '../types';
import StatsCard from '../components/StatsCard';
import LoadingState from '../components/LoadingState';
import { useHistory } from '../hooks/useHistory';

export default function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { history } = useHistory();

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading analytics..." />;

  // Count most-searched topics from history
  const topTopics = history.reduce<Record<string, number>>((acc, item) => {
    const key = item.lectureTitle || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const sortedTopics = Object.entries(topTopics).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-5xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">
          Real metrics from your lecture knowledge base.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Lectures" value={stats?.total_lectures ?? '—'} icon={<Library size={18} />} />
        <StatsCard label="Total Chunks" value={stats?.total_chunks?.toLocaleString() ?? '—'} icon={<FileText size={18} />} />
        <StatsCard label="Questions Asked" value={history.length || '—'} icon={<MessageSquare size={18} />} />
        <StatsCard label="Embeddings" value={stats?.embeddings_loaded ? 'Loaded' : 'Not loaded'} icon={<BarChart3 size={18} />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lecture list */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-4">Indexed Lectures</h3>
          <div className="space-y-2">
            {stats?.lecture_titles.map((title, i) => (
              <div key={title} className="flex items-center gap-3 text-sm">
                <span className="text-xs font-mono text-[var(--color-accent)] w-6">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[var(--color-primary)] flex-1 truncate">{title}</span>
              </div>
            )) ?? <p className="text-sm text-[var(--color-secondary)]">No data available</p>}
          </div>
        </div>

        {/* Most searched lectures */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-4">Most Queried Lectures</h3>
          {sortedTopics.length > 0 ? (
            <div className="space-y-3">
              {sortedTopics.map(([topic, count]) => (
                <div key={topic}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--color-primary)] truncate flex-1">{topic}</span>
                    <span className="text-xs text-[var(--color-secondary)] ml-2">{count} queries</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] rounded-full transition-all"
                      style={{ width: `${(count / sortedTopics[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-secondary)]">Ask some questions to see analytics here.</p>
          )}
        </div>
      </div>

      {/* Technical Insights */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-4">Technical Architecture</h2>
        <p className="text-sm text-[var(--color-secondary)] mb-6">How the RAG pipeline processes your lectures.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Mic, label: 'Whisper', desc: 'Speech → Timestamped Transcript', color: 'bg-orange-50 text-orange-600' },
            { icon: Brain, label: 'BGE-M3', desc: 'Transcript → Semantic Embeddings', color: 'bg-purple-50 text-purple-600' },
            { icon: Search, label: 'Cosine Similarity', desc: 'Question → Relevant Chunks', color: 'bg-emerald-50 text-emerald-600' },
            { icon: Cpu, label: 'Gemini', desc: 'Context → Grounded Answer', color: 'bg-blue-50 text-blue-600' },
          ].map(step => (
            <div key={step.label} className="card p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${step.color}`}>
                <step.icon size={16} />
              </div>
              <p className="text-sm font-semibold text-[var(--color-primary)]">{step.label}</p>
              <p className="text-xs text-[var(--color-secondary)] mt-0.5">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
