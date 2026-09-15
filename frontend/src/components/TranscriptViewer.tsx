import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, Play } from 'lucide-react';
import type { TranscriptChunk } from '../types';
import { formatTime } from '../utils/formatTime';

interface TranscriptViewerProps {
  chunks: TranscriptChunk[];
  currentTime?: number;
  onSeek: (time: number) => void;
  highlightedStart?: number | null;
}

export default function TranscriptViewer({ chunks, currentTime = 0, onSeek, highlightedStart }: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Filter chunks by search
  const filteredChunks = useMemo(() => {
    if (!searchQuery.trim()) return chunks;
    const q = searchQuery.toLowerCase();
    return chunks.filter(c => c.text.toLowerCase().includes(q));
  }, [chunks, searchQuery]);

  // Find current active chunk
  const activeIndex = useMemo(() => {
    if (highlightedStart !== null && highlightedStart !== undefined) {
      return chunks.findIndex(c => Math.abs(c.start - highlightedStart) < 0.5);
    }
    for (let i = chunks.length - 1; i >= 0; i--) {
      if (currentTime >= chunks[i].start) return i;
    }
    return -1;
  }, [chunks, currentTime, highlightedStart]);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current && !searchQuery) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex, searchQuery]);

  const highlightText = useCallback((text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-yellow-200 text-[var(--color-primary)] rounded px-0.5">{part}</mark>
        : part
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript..."
            className="input-field text-sm pl-8 py-2"
            aria-label="Search transcript"
          />
        </div>
        <p className="text-[10px] text-[var(--color-secondary)] mt-1.5">
          {filteredChunks.length} of {chunks.length} segments
        </p>
      </div>

      {/* Transcript list */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        {filteredChunks.map((chunk, i) => {
          const originalIndex = chunks.indexOf(chunk);
          const isActive = originalIndex === activeIndex;
          return (
            <div
              key={`${chunk.start}-${i}`}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSeek(chunk.start)}
              className={`flex gap-3 px-4 py-3 cursor-pointer border-b border-[var(--color-border)]/50 transition-colors ${
                isActive
                  ? 'bg-[var(--color-accent-light)] border-l-2 border-l-[var(--color-accent)]'
                  : 'hover:bg-[var(--color-background)]'
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Jump to ${formatTime(chunk.start)}`}
              onKeyDown={(e) => e.key === 'Enter' && onSeek(chunk.start)}
            >
              <span className="text-[11px] font-mono text-[var(--color-accent)] whitespace-nowrap pt-0.5 w-12 flex-shrink-0">
                {formatTime(chunk.start)}
              </span>
              <p className="text-sm text-[var(--color-primary)] leading-relaxed flex-1">
                {highlightText(chunk.text)}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onSeek(chunk.start); }}
                className="opacity-0 group-hover:opacity-100 text-[var(--color-accent)] p-1 flex-shrink-0 self-center"
                aria-label="Play from here"
              >
                <Play size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
