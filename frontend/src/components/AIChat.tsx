import { useState, useRef, useCallback } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import type { ChatMessage, Source } from '../types';
import { api } from '../services/api';
import { generateId } from '../utils/formatTime';
import SourceCard from './SourceCard';

interface AIChatProps {
  lectureNumber?: string;
  onSeek: (time: number) => void;
  onAddToHistory?: (question: string, answer: string, sources: Source[]) => void;
  onBookmarkSource?: (source: Source) => void;
  isSourceBookmarked?: (number: string, start: number) => boolean;
}

const SUGGESTIONS = [
  'What topics are covered in this lecture?',
  'Explain the main concepts discussed',
  'Where was the most important concept explained?',
  'Summarize the key takeaways',
];

export default function AIChat({ lectureNumber, onSeek, onAddToHistory, onBookmarkSource, isSourceBookmarked }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [scope, setScope] = useState<'lesson' | 'course'>('lesson');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async (question?: string) => {
    const q = (question || input).trim();
    if (!q || loading) return;

    setInput('');
    setError(null);
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: q, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const targetLec = scope === 'course' ? undefined : lectureNumber;

    // Animated loading phases
    setLoadingPhase(scope === 'course' ? 'Searching full course knowledge base...' : 'Searching this lecture...');
    const phaseTimer1 = setTimeout(() => setLoadingPhase('Finding relevant moments across lessons...'), 1500);
    const phaseTimer2 = setTimeout(() => setLoadingPhase('Synthesizing answer...'), 3000);

    try {
      const response = await api.ask(q, targetLec);
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      onAddToHistory?.(q, response.answer, response.sources);
    } catch (err: any) {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      try {
        const { answerFromCurriculum } = await import('../utils/curriculumRAG');
        const fallbackRes = answerFromCurriculum(q, targetLec);
        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: fallbackRes.answer,
          sources: fallbackRes.sources,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        onAddToHistory?.(q, fallbackRes.answer, fallbackRes.sources);
      } catch {
        setError('The AI engine is temporarily busy. Please try asking again in a moment.');
      }
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  }, [input, loading, lectureNumber, scope, onAddToHistory]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with Course Scope Toggle */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--color-accent)]" />
            <h3 className="text-sm font-semibold text-[var(--color-primary)]">Ask AI</h3>
          </div>
          <p className="text-xs text-[var(--color-secondary)] mt-0.5">
            {scope === 'course' ? 'Searching across entire course playlist' : 'Searching this video'}
          </p>
        </div>

        {lectureNumber && (
          <div className="flex p-0.5 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)]">
            <button
              onClick={() => setScope('lesson')}
              className={`px-2 py-1 text-[11px] rounded-md transition-all cursor-pointer ${
                scope === 'lesson'
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-semibold shadow-sm'
                  : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              This Video
            </button>
            <button
              onClick={() => setScope('course')}
              className={`px-2 py-1 text-[11px] rounded-md transition-all cursor-pointer ${
                scope === 'course'
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent)] font-semibold shadow-sm'
                  : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Full Course
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="animate-fade-in">
            <p className="text-sm text-[var(--color-secondary)] mb-4">Try asking:</p>
            <div className="space-y-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="w-full text-left text-sm px-3 py-2.5 rounded-md border border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className="animate-slide-up">
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-[var(--color-accent)] text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[85%]">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[var(--color-background)] px-4 py-3 rounded-2xl rounded-bl-md text-sm text-[var(--color-primary)] leading-relaxed max-w-[95%] whitespace-pre-wrap">
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="space-y-2">
                    <span className="section-title">Sources from your lecture</span>
                    {msg.sources.map((source, i) => (
                      <SourceCard
                        key={`${source.start}-${i}`}
                        source={source}
                        index={i}
                        onSeek={onSeek}
                        onBookmark={onBookmarkSource ? () => onBookmarkSource(source) : undefined}
                        isBookmarked={isSourceBookmarked?.(source.number, source.start)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 animate-fade-in py-2 px-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] w-fit">
            <Loader2 size={14} className="text-[var(--color-accent)] animate-spin" />
            <span className="text-xs text-[var(--color-secondary)] font-medium">{loadingPhase}</span>
            <span className="inline-block w-1.5 h-3.5 bg-[var(--color-accent)] animate-pulse rounded-full shadow-[0_0_8px_var(--color-accent)] ml-0.5" />
          </div>
        )}

        {error && (
          <div className="bg-[var(--color-error-light)] border border-red-200 rounded-lg px-4 py-3 animate-slide-up">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="relative rounded-lg border border-[var(--color-border)] focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20 transition-all bg-[var(--color-background)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this lecture..."
            className="w-full bg-transparent px-3.5 py-2.5 text-sm pr-12 resize-none focus:outline-none text-[var(--color-primary)] placeholder-[var(--color-secondary)]"
            rows={2}
            disabled={loading}
            aria-label="Ask a question"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            className="absolute right-2 bottom-2 p-2 rounded-md bg-[var(--color-accent)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-accent-hover)] transition-all transform hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Send question"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--color-secondary)] mt-1.5 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Teaching Assistant Online
          </span>
          <span className="opacity-60 hidden sm:inline">Press Enter ↵ to send</span>
        </div>
      </div>
    </div>
  );
}
