import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Sparkles,
  Radio,
  Clock,
  BookOpen,
  Code2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import type { LectureCurriculum } from '../data/lectureCurriculum';

interface AudioPodcastBriefingProps {
  lectureNumber: string;
  lectureTitle: string;
  curriculum?: LectureCurriculum | null;
}

interface PodcastChapter {
  id: number;
  title: string;
  duration: string;
  totalSecs: number;
  icon: typeof BookOpen;
  text: string;
}

export default function AudioPodcastBriefing({
  lectureNumber,
  lectureTitle,
  curriculum,
}: AudioPodcastBriefingProps) {
  // Generate structured conversational chapters from curriculum
  const chapters: PodcastChapter[] = useMemo(() => {
    const title = curriculum?.title || lectureTitle || 'this lesson';
    const overview =
      curriculum?.overview ||
      'In this session, we break down foundational web development principles from first principles.';

    const theoryPoints =
      curriculum?.theory && curriculum.theory.length > 0
        ? curriculum.theory.map((t) => `${t.subheading}. ${t.content}`).join(' ')
        : 'We explore foundational architecture, Document Object Model rendering, and client-server workflows.';

    const codeHighlights =
      curriculum?.code_samples && curriculum.code_samples.length > 0
        ? `In the code laboratory, the instructor demonstrates: ${curriculum.code_samples[0].caption}. Always ensure proper semantic nesting so browser rendering engines construct clean DOM trees.`
        : 'Writing standards-compliant production syntax ensures optimal cross-browser consistency and responsive rendering.';

    const pitfallPoints =
      curriculum?.pitfalls && curriculum.pitfalls.length > 0
        ? `Watch out for these critical traps: ${curriculum.pitfalls.join('. ')}.`
        : 'Avoid skipping foundational syntax validation, and always inspect elements using browser developer tools.';

    return [
      {
        id: 0,
        title: 'Introduction & Core Objective',
        duration: '0:45',
        totalSecs: 45,
        icon: Sparkles,
        text: `Welcome to your LectureAI audio briefing for Lesson ${lectureNumber}: ${title}. Today, we're cutting through the noise to give you the mental model you need. ${overview} Let's break it down into core principles.`,
      },
      {
        id: 1,
        title: 'First-Principles Architectural Theory',
        duration: '1:05',
        totalSecs: 65,
        icon: BookOpen,
        text: `Let's dive into the core mechanics. ${theoryPoints} Understanding how the browser parses and executes these structures ensures your applications stay fast, accessible, and maintainable.`,
      },
      {
        id: 2,
        title: 'Production Code Demonstration',
        duration: '0:40',
        totalSecs: 40,
        icon: Code2,
        text: `${codeHighlights} Keep your files well-structured, use consistent naming conventions, and verify every visual change across mobile and desktop viewports.`,
      },
      {
        id: 3,
        title: 'Gotchas, Traps & Key Takeaways',
        duration: '0:50',
        totalSecs: 50,
        icon: AlertTriangle,
        text: `${pitfallPoints} That concludes your 3-minute executive briefing for Lesson ${lectureNumber}. Open the sandbox to experiment with your code, or take the active recall quiz to lock this into long-term memory!`,
      },
    ];
  }, [curriculum, lectureNumber, lectureTitle]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentStartCharRef = useRef<number>(0);
  const currentCharOffsetRef = useRef<number>(0);

  // Initialize and discover available browser voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      const engVoices = allVoices.filter((v) => v.lang.startsWith('en'));
      const activeList = engVoices.length > 0 ? engVoices : allVoices;
      setVoices(activeList);

      const preferredIdx = activeList.findIndex(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Jenny')
      );
      if (preferredIdx !== -1) {
        setSelectedVoiceIndex(preferredIdx);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak a specific chapter, optionally starting from a specific character index
  const speakChapter = useCallback(
    (index: number, startChar = 0, overrideRate?: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      if (index < 0 || index >= chapters.length) {
        setIsPlaying(false);
        setActiveChapterIndex(0);
        setProgressPercent(0);
        currentStartCharRef.current = 0;
        currentCharOffsetRef.current = 0;
        return;
      }

      const chapter = chapters[index];
      setActiveChapterIndex(index);

      // Clamp startChar to valid bounds
      const safeStart = Math.max(0, Math.min(chapter.text.length - 1, startChar));
      currentStartCharRef.current = safeStart;
      currentCharOffsetRef.current = safeStart;

      const pct = Math.min(100, Math.round((safeStart / chapter.text.length) * 100));
      setProgressPercent(pct);

      const textToSpeak = chapter.text.slice(safeStart);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }
      utterance.rate = overrideRate || playbackRate;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onboundary = (event) => {
        if (typeof event.charIndex === 'number' && chapter.text.length > 0) {
          const currentPos = currentStartCharRef.current + event.charIndex;
          currentCharOffsetRef.current = currentPos;
          const newPct = Math.min(100, Math.round((currentPos / chapter.text.length) * 100));
          setProgressPercent(newPct);
        }
      };

      utterance.onend = () => {
        setProgressPercent(100);
        currentCharOffsetRef.current = chapter.text.length;
        if (index < chapters.length - 1) {
          setTimeout(() => {
            speakChapter(index + 1, 0);
          }, 350);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis state:', e);
        }
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;

      // Small tick to ensure browser cancels prior audio cleanly
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        } catch (err) {
          console.error('Failed to trigger speech synthesis:', err);
          setIsPlaying(false);
        }
      }, 40);
    },
    [chapters, isMuted, playbackRate, selectedVoiceIndex, voices]
  );

  const handleTogglePlay = () => {
    if (!isPlaying) {
      // Resume from current character position if paused mid-chapter
      speakChapter(activeChapterIndex, currentCharOffsetRef.current);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    currentCharOffsetRef.current = 0;
    speakChapter(activeChapterIndex, 0);
  };

  const handleSkipNext = () => {
    const nextIdx = Math.min(chapters.length - 1, activeChapterIndex + 1);
    currentCharOffsetRef.current = 0;
    speakChapter(nextIdx, 0);
  };

  const handleSkipPrev = () => {
    const prevIdx = Math.max(0, activeChapterIndex - 1);
    currentCharOffsetRef.current = 0;
    speakChapter(prevIdx, 0);
  };

  // Changing rate resumes smoothly from the exact current character position!
  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      speakChapter(activeChapterIndex, currentCharOffsetRef.current, rate);
    }
  };

  // Seek to percentage on the scrubber bar
  const seekToPercent = (pct: number) => {
    const chapter = chapters[activeChapterIndex];
    const targetChar = Math.round((pct / 100) * chapter.text.length);
    // Find nearest space/word boundary
    const spaceIdx = chapter.text.indexOf(' ', targetChar);
    const cleanChar = spaceIdx !== -1 && spaceIdx - targetChar < 25 ? spaceIdx + 1 : targetChar;
    const safeChar = Math.max(0, Math.min(chapter.text.length - 1, cleanChar));

    currentCharOffsetRef.current = safeChar;
    setProgressPercent(pct);
    if (isPlaying) {
      speakChapter(activeChapterIndex, safeChar);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
    seekToPercent(pct);
  };

  const handleSkipSeconds = (deltaSecs: number) => {
    const chapter = chapters[activeChapterIndex];
    const deltaPct = (deltaSecs / chapter.totalSecs) * 100;
    const newPct = Math.max(0, Math.min(100, Math.round(progressPercent + deltaPct)));
    seekToPercent(newPct);
  };

  const handleCopyScript = () => {
    const fullScript = chapters.map((c) => `[${c.title}]\n${c.text}`).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!speechSupported) {
    return (
      <div className="p-8 text-center text-xs text-[var(--color-secondary)]">
        Web Speech synthesis is not supported in this browser. Please use Chrome, Edge, Safari, or Firefox.
      </div>
    );
  }

  const currentChapter = chapters[activeChapterIndex];
  const currentSecs = Math.min(
    currentChapter.totalSecs,
    Math.round((progressPercent / 100) * currentChapter.totalSecs)
  );

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* Hero Audio Player Deck (Apple / Spotify Podcasts aesthetic) */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-[var(--color-background)] to-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
        {/* Deck Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Radio size={16} className={isPlaying ? 'animate-pulse' : ''} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400 block">
                LectureAI Audio Briefing
              </span>
              <h3 className="text-xs font-bold text-[var(--color-primary)]">
                Lesson {lectureNumber} • 3-Min Podcast
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPlaying ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                PLAYING
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-background)] text-[var(--color-secondary)] text-[10px] font-medium border border-[var(--color-border)] flex items-center gap-1">
                <Clock size={11} /> ~3:20 total
              </span>
            )}
          </div>
        </div>

        {/* Current Chapter Badge & Title */}
        <div className="pt-1">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-secondary)] mb-1">
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Chapter {activeChapterIndex + 1} of {chapters.length}:
            </span>
            <span>{currentChapter.duration}</span>
          </div>
          <h4 className="text-sm font-bold text-[var(--color-primary)] line-clamp-1">
            {currentChapter.title}
          </h4>
        </div>

        {/* Live Audio Visualizer Equalizer */}
        <div className="h-10 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] flex items-center justify-center gap-1 px-4 overflow-hidden">
          {[12, 28, 45, 18, 38, 52, 24, 40, 16, 48, 30, 15, 35, 50, 22, 42, 28, 14, 32, 20].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying
                  ? 'bg-gradient-to-t from-purple-500 to-emerald-400'
                  : 'bg-[var(--color-secondary)]/30'
              }`}
              style={{
                height: isPlaying ? `${Math.max(6, (h * ((i % 4) + 1.2)) % 34)}px` : '5px',
                transitionDelay: `${(i % 5) * 20}ms`,
              }}
            />
          ))}
        </div>

        {/* Interactive Scrubbable Timeline Progress Bar */}
        <div className="space-y-1.5">
          <div
            onClick={handleTimelineClick}
            className="relative w-full py-2 cursor-pointer group select-none"
            title="Click or drag to seek in chapter"
          >
            <div className="w-full h-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber thumb handle indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white shadow-md transition-transform group-hover:scale-125 pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--color-secondary)] font-mono">
            <span className="font-semibold text-[var(--color-primary)]">
              {formatTime(currentSecs)} / {currentChapter.duration}
            </span>
            <span>Chapter {activeChapterIndex + 1} of {chapters.length}</span>
          </div>
        </div>

        {/* Hero Transport Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Left: Prev, -10s, Play, +10s, Next, Restart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleSkipPrev}
              disabled={activeChapterIndex === 0}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer transition-all"
              title="Previous Chapter"
            >
              <Rewind size={15} />
            </button>

            {/* Rewind -10s */}
            <button
              onClick={() => handleSkipSeconds(-10)}
              className="px-2 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:border-purple-500/40 cursor-pointer transition-all text-[10px] font-mono font-bold"
              title="Rewind 10 seconds"
            >
              -10s
            </button>

            {/* Primary Action Button */}
            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? (
                <Pause size={20} className="fill-white" />
              ) : (
                <Play size={20} className="fill-white ml-0.5" />
              )}
            </button>

            {/* Forward +10s */}
            <button
              onClick={() => handleSkipSeconds(10)}
              className="px-2 py-1.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:border-purple-500/40 cursor-pointer transition-all text-[10px] font-mono font-bold"
              title="Forward 10 seconds"
            >
              +10s
            </button>

            <button
              onClick={handleSkipNext}
              disabled={activeChapterIndex === chapters.length - 1}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer transition-all"
              title="Next Chapter"
            >
              <FastForward size={15} />
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] cursor-pointer transition-all"
              title="Restart Chapter"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Right: Rate & Mute */}
          <div className="flex items-center gap-2">
            {/* Speed Multipliers */}
            <div className="flex items-center bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-0.5 text-[11px] font-semibold">
              {[1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Mute */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (utteranceRef.current) {
                  utteranceRef.current.volume = nextMute ? 0 : 1;
                }
              }}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Voice Selector Row */}
        {voices.length > 0 && (
          <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between gap-3 text-xs">
            <span className="text-[11px] font-semibold text-[var(--color-secondary)] flex items-center gap-1.5 shrink-0">
              <Sparkles size={13} className="text-purple-500" />
              AI Voice:
            </span>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                setSelectedVoiceIndex(idx);
                if (isPlaying) speakChapter(activeChapterIndex);
              }}
              className="flex-1 max-w-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] text-[var(--color-primary)] focus:outline-none cursor-pointer truncate"
            >
              {voices.map((v, idx) => (
                <option key={idx} value={idx}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Interactive Episode Chapters (Click any chapter to listen!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">
            Episode Chapters (Click to Play)
          </h4>
          <button
            onClick={handleCopyScript}
            className="text-[11px] font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy full podcast script"
          >
            {isCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{isCopied ? 'Copied' : 'Copy Script'}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {chapters.map((ch, idx) => {
            const isCurrent = activeChapterIndex === idx;
            const Icon = ch.icon;

            return (
              <div
                key={ch.id}
                onClick={() => speakChapter(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isCurrent
                    ? 'bg-purple-500/5 border-purple-500/60 shadow-sm'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border)]/80 hover:bg-[var(--color-background)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-purple-600 text-white'
                          : 'bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)]'
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[var(--color-primary)] block">
                        {idx + 1}. {ch.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[var(--color-secondary)]">
                      {ch.duration}
                    </span>
                    {isCurrent && isPlaying ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)]">
                        <Play size={10} className="ml-0.5 fill-current" />
                      </div>
                    )}
                  </div>
                </div>

                <p
                  className={`text-xs leading-relaxed transition-colors ${
                    isCurrent
                      ? 'text-[var(--color-primary)] font-medium'
                      : 'text-[var(--color-secondary)] line-clamp-2'
                  }`}
                >
                  {ch.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
