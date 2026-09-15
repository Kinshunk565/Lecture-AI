import { Play, Bookmark as BookmarkIcon } from 'lucide-react';
import type { Source } from '../types';
import { formatTime, truncate } from '../utils/formatTime';

interface SourceCardProps {
  source: Source;
  index: number;
  onSeek: (time: number) => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export default function SourceCard({ source, index, onSeek, onBookmark, isBookmarked }: SourceCardProps) {
  return (
    <div className="card p-4 animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between mb-2">
        <span className="section-title">Source {String(index + 1).padStart(2, '0')}</span>
        <div className="flex items-center gap-1">
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`p-1 rounded transition-colors ${
                isBookmarked
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-secondary)] opacity-40 hover:opacity-100'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this source'}
            >
              <BookmarkIcon size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm font-medium text-[var(--color-primary)] mb-1">
        Video {source.number} — {source.title}
      </p>

      <p className="text-xs text-[var(--color-secondary)] mb-3 leading-relaxed">
        "{truncate(source.text, 200)}"
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--color-secondary)]">
          {formatTime(source.start)} — {formatTime(source.end)}
        </span>
        <button
          onClick={() => onSeek(source.start)}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
        >
          <Play size={12} /> Jump to timestamp
        </button>
      </div>
    </div>
  );
}
