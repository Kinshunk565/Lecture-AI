import { Link } from 'react-router-dom';
import { Clock, Trash2, MessageSquare, ArrowRight } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { formatRelativeTime, truncate } from '../utils/formatTime';
import EmptyState from '../components/EmptyState';

export default function History() {
  const { history, clearHistory, removeFromHistory } = useHistory();

  return (
    <div className="p-6 md:p-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Question History</h1>
          <p className="text-sm text-[var(--color-secondary)] mt-1">
            {history.length} questions asked
          </p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn-secondary text-xs">
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock size={24} className="text-[var(--color-secondary)]" />}
          title="No history yet"
          description="Your AI questions will appear here. Start by asking about a lecture."
          actionLabel="Search Lectures"
          actionTo="/search"
        />
      ) : (
        <div className="space-y-2">
          {history.map(item => (
            <div key={item.id} className="card px-4 py-3.5 flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-md bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare size={14} className="text-[var(--color-accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-primary)]">{item.question}</p>
                <p className="text-xs text-[var(--color-secondary)] mt-1 line-clamp-2">
                  {truncate(item.answer, 150)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-secondary)]">
                  <span>{formatRelativeTime(item.timestamp)}</span>
                  {item.lectureTitle && (
                    <>
                      <span>·</span>
                      <span>Video {item.lectureNumber}</span>
                    </>
                  )}
                  {item.sources.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{item.sources.length} sources</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.lectureNumber && (
                  <Link
                    to={`/lectures/${item.lectureNumber}`}
                    className="p-1.5 rounded text-[var(--color-secondary)] hover:text-[var(--color-accent)] transition-colors"
                    aria-label="Go to lecture"
                  >
                    <ArrowRight size={14} />
                  </Link>
                )}
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="p-1.5 rounded text-[var(--color-secondary)] hover:text-[var(--color-error)] transition-colors"
                  aria-label="Remove from history"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
