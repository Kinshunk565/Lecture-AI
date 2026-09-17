import { useState, useEffect, useRef } from 'react';
import { PenTool, Clock, Copy, Check, Sparkles, FileDown, Eye, Edit3 } from 'lucide-react';
import type { LectureCurriculum } from '../data/lectureCurriculum';


interface LectureNotesProps {
  lectureNumber: string;
  lectureTitle: string;
  currentTime: number;
  curriculum?: LectureCurriculum | null;
  onSeek: (seconds: number) => void;
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LectureNotes({
  lectureNumber,
  lectureTitle,
  currentTime,
  curriculum,
  onSeek,
}: LectureNotesProps) {
  const storageKey = `lectureai_notes_${lectureNumber}`;

  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem(storageKey) || '';
  });
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, notes);
  }, [notes, storageKey]);

  // Tag current video time into the notes
  const handleInsertTimestamp = () => {
    const timeTag = ` [⏱ ${formatSeconds(currentTime)}] `;
    if (!textareaRef.current) {
      setNotes((prev) => prev + timeTag);
      return;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const nextText = notes.substring(0, start) + timeTag + notes.substring(end);
    setNotes(nextText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + timeTag.length, start + timeTag.length);
      }
    }, 50);
  };

  // Pre-fill notes with structured AI outline
  const handleInsertAIOutline = () => {
    if (!curriculum) return;

    let outline = `\n## 📚 Summary Outline: ${lectureTitle}\n\n`;
    outline += `### Core Takeaways:\n`;
    curriculum.key_takeaways?.forEach((t) => {
      outline += `• ${t}\n`;
    });

    outline += `\n### Key Concepts:\n`;
    curriculum.theory?.forEach((t) => {
      outline += `\n#### ${t.subheading}\n${t.content.slice(0, 160)}...\n`;
    });

    if (curriculum.pitfalls && curriculum.pitfalls.length > 0) {
      outline += `\n### ⚠️ Traps to Avoid:\n`;
      curriculum.pitfalls.forEach((p) => {
        outline += `• ${p}\n`;
      });
    }

    setNotes((prev) => (prev ? prev + '\n' + outline : outline));
  };

  // Export to Markdown (.md) file
  const handleExportMarkdown = () => {
    const mdContent = `# Lecture ${lectureNumber}: ${lectureTitle}\n*Exported from LectureAI Notes*\n\n---\n\n${notes || '*No notes written yet.*'}\n\n---\n\n### Official Curriculum Takeaways:\n${curriculum?.key_takeaways?.map((t) => `- ${t}`).join('\n') || ''}\n`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lecture_${lectureNumber}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Render clickable timestamps in preview
  const renderPreview = () => {
    if (!notes.trim()) {
      return (
        <div className="py-12 text-center text-xs text-[var(--color-secondary)] italic">
          Your notebook is empty. Type in Edit mode or click "Insert AI Outline" to get started!
        </div>
      );
    }

    // Split by timestamp regex [⏱ MM:SS]
    const parts = notes.split(/(\[⏱\s*\d{1,2}:\d{2}\])/g);

    return (
      <div className="text-xs text-[var(--color-primary)] whitespace-pre-wrap leading-relaxed space-y-2">
        {parts.map((part, idx) => {
          const match = part.match(/\[⏱\s*(\d{1,2}):(\d{2})\]/);
          if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const totalSec = minutes * 60 + seconds;

            return (
              <button
                key={idx}
                onClick={() => onSeek(totalSec)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-1 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white font-mono text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                title={`Jump video to ${match[1]}:${match[2]}`}
              >
                <Clock size={10} />
                <span>{match[1]}:{match[2]}</span>
              </button>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between p-2.5 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <PenTool size={14} className="text-[var(--color-accent)]" />
          <span className="font-semibold text-[var(--color-primary)]">
            Personal Notes
          </span>

          <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-0.5 ml-2">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'edit'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <Edit3 size={10} /> Edit
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'preview'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <Eye size={10} /> Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Insert current time tag */}
          <button
            onClick={handleInsertTimestamp}
            className="px-2 py-1 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
            title="Tag current video timestamp into your notes"
          >
            <Clock size={12} />
            <span>Tag {formatSeconds(currentTime)}</span>
          </button>

          {/* Insert AI Outline */}
          <button
            onClick={handleInsertAIOutline}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Insert structured AI lecture outline"
          >
            <Sparkles size={13} className="text-amber-400" />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Copy notes"
          >
            {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          {/* Export to Markdown */}
          <button
            onClick={handleExportMarkdown}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
            title="Export as Markdown (.md) for Notion/Obsidian"
          >
            <FileDown size={13} />
          </button>
        </div>
      </div>

      {/* Main Notes Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {viewMode === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write personal takeaways, thoughts, and click 'Tag Time' to bookmark moments..."
            className="w-full h-full bg-transparent text-xs text-[var(--color-primary)] resize-none focus:outline-none font-sans leading-relaxed selection:bg-[var(--color-accent)]/30"
          />
        ) : (
          renderPreview()
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 border-t border-[var(--color-border)] bg-[var(--color-background)]/40 flex items-center justify-between text-[10px] text-[var(--color-secondary)]">
        <span>Auto-saved locally</span>
        <span>{notes.length} characters</span>
      </div>
    </div>
  );
}
