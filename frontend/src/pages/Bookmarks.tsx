import { Link } from 'react-router-dom';
import { Bookmark as BookmarkIcon, Play, Trash2 } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';
import { formatTime, formatRelativeTime } from '../utils/formatTime';
import EmptyState from '../components/EmptyState';

export default function Bookmarks() {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  return (
    <div className="p-6 md:p-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Saved Moments</h1>
          <p className="text-sm text-[var(--color-secondary)] mt-1">
            {bookmarks.length} bookmarked timestamps
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button onClick={clearBookmarks} className="btn-secondary text-xs">
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<BookmarkIcon size={24} className="text-[var(--color-secondary)]" />}
          title="No bookmarks yet"
          description="Bookmark timestamps and sources while asking questions about lectures."
          actionLabel="Browse Lectures"
          actionTo="/lectures"
        />
      ) : (
        <div className="space-y-2">
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="card px-4 py-3.5 flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-md bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookmarkIcon size={14} className="text-[var(--color-accent)]" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[var(--color-accent)]">
                    {formatTime(bookmark.start)} — {formatTime(bookmark.end)}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-primary)] line-clamp-2">{bookmark.text}</p>
                <p className="text-xs text-[var(--color-secondary)] mt-1">
                  Video {bookmark.lectureNumber} · {bookmark.lectureTitle} · {formatRelativeTime(bookmark.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  to={`/lectures/${bookmark.lectureNumber}`}
                  className="p-1.5 rounded text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors"
                  aria-label="Go to lecture"
                >
                  <Play size={14} />
                </Link>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="p-1.5 rounded text-[var(--color-secondary)] hover:text-[var(--color-error)] transition-colors"
                  aria-label="Remove bookmark"
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
