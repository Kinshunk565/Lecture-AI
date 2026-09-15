import { Link } from 'react-router-dom';
import { Play, MessageSquare, FileText } from 'lucide-react';
import type { Lecture } from '../types';
import { formatDuration } from '../utils/formatTime';

interface LectureCardProps {
  lecture: Lecture;
}

export default function LectureCard({ lecture }: LectureCardProps) {
  return (
    <div className="card overflow-hidden group">
      {/* Thumbnail placeholder */}
      <div className="h-36 bg-gradient-to-br from-[var(--color-background)] to-[var(--color-border)] flex items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Play size={20} className="text-[var(--color-accent)] ml-0.5" />
          </div>
          <span className="text-xs font-medium text-[var(--color-secondary)]">Video {lecture.number}</span>
        </div>
        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)]">
            {lecture.indexed ? 'Indexed' : 'Not indexed'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-1 leading-snug line-clamp-2">
          {lecture.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-[var(--color-secondary)] mb-4">
          <span className="flex items-center gap-1">
            <FileText size={12} />
            {lecture.chunk_count} chunks
          </span>
          {lecture.duration > 0 && (
            <span>{formatDuration(lecture.duration)}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/lectures/${lecture.number}`}
            className="btn-primary text-xs flex-1 justify-center py-2"
          >
            <Play size={14} /> Open
          </Link>
          <Link
            to={`/lectures/${lecture.number}?ask=true`}
            className="btn-secondary text-xs flex-1 justify-center py-2"
          >
            <MessageSquare size={14} /> Ask AI
          </Link>
        </div>
      </div>
    </div>
  );
}
