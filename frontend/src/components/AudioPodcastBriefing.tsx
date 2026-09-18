import { useState, useEffect, useRef, useMemo } from 'react';
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
  icon: typeof BookOpen;
  text: string;
}

export default function AudioPodcastBriefing({
  lectureNumber,
  lectureTitle,
  curriculum,
}: AudioPodcastBriefingProps) {
  // Generate conversational chapters
  const chapters: PodcastChapter[] = useMemo(() => {
    const title = curriculum?.title || lectureTitle || 'this lesson';
    const overview = curriculum?.overview || 'In this session, we break down foundational web development principles from first principles.';

    const theoryPoints = curriculum?.theory && curriculum.theory.length > 0
      ? curriculum.theory.map((t) => `${t.subheading}. ${t.content}`).join(' ')
      : 'We explore foundational architecture, Document Object Model rendering, and client-server workflows.';

    const codeHighlights = curriculum?.code_samples && curriculum.code_samples.length > 0
      ? `In the code laboratory, the instructor demonstrates: ${curriculum.code_samples[0].caption}. Always ensure proper semantic nesting so browser rendering engines construct clean DOM trees.`
      : 'Writing standards-compliant production syntax ensures optimal cross-browser consistency and responsive rendering.';

    const pitfallPoints = curriculum?.pitfalls && curriculum.pitfalls.length > 0
      ? `Watch out for these critical traps: ${curriculum.pitfalls.join('. ')}.`
      : 'Avoid skipping foundational syntax validation, and always inspect elements using browser developer tools.';

    return [
      {
        id: 0,
        title: 'Introduction & Core Objective',
        duration: '0:45',
        icon: Sparkles,
        text: `Welcome to your LectureAI audio briefing for Lesson ${lectureNumber}: ${title}. Today, we're cutting through the noise to give you the mental model you need. ${overview} Let's break it down into core principles.`,
      },
      {
        id: 1,
        title: 'First-Principles Architectural Theory',
        duration: '1:05',
        icon: BookOpen,
        text: `Let's dive into the core mechanics. ${theoryPoints} Understanding how the browser parses and executes these structures ensures your applications stay fast, accessible, and maintainable.`,
      },
      {
        id: 2,
        title: 'Production Code Demonstration',
        duration: '0:40',
        icon: Code2,
        text: `${codeHighlights} Keep your files well-structured, use consistent naming conventions, and verify every visual change across mobile and desktop viewports.`,
      },
      {
        id: 3,
        title: 'Gotchas, Traps & Key Takeaways',
        duration: '0:50',
        icon: AlertTriangle,
        text: `${pitfallPoints} That concludes your 3-minute executive briefing for Lesson ${lectureNumber}. Open the sandbox to experiment with your code, or take the active recall quiz to lock this into long-term memory!`,
      },
    ];
  }, [curriculum, lectureNumber, lectureTitle]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [speechSupported, setSpeechSupported] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for English voices if possible, or all
      const engVoices = allVoices.filter((v) => v.lang.startsWith('en'));
      const activeList = engVoices.length > 0 ? engVoices : allVoices;
      setVoices(activeList);

      // Prefer a natural, female, or US/UK voice
      const preferredIdx = activeList.findIndex(
        (v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')
      );
      if (preferredIdx !== -1) {
        setSelectedVoiceIndex(preferredIdx);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak a specific chapter
  const speakChapter = (index: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (index >= chapters.length) {
      setIsPlaying(false);
      setActiveChapterIndex(0);
      return;
    }

    const chapter = chapters[index];
    setActiveChapterIndex(index);

    const utterance = new SpeechSynthesisUtterance(chapter.text);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => {
      // Advance to next chapter automatically
      if (index < chapters.length - 1) {
        speakChapter(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      // Don't treat cancellation as an error
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error('Speech synthesis error:', e);
      }
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      speakChapter(activeChapterIndex);
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    window.speechSynthesis.cancel();
    speakChapter(0);
  };

  const handleSkipNext = () => {
    const nextIdx = Math.min(chapters.length - 1, activeChapterIndex + 1);
    speakChapter(nextIdx);
  };

  const handleSkipPrev = () => {
    const prevIdx = Math.max(0, activeChapterIndex - 1);
    speakChapter(prevIdx);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      speakChapter(activeChapterIndex);
    }
  };

  // Stop audio if component unmounts
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

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] overflow-y-auto select-none p-5 space-y-6">
      {/* Radio Broadcast Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-accent)]/10 to-[var(--color-background)] border border-[var(--color-accent)]/30 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-accent)] text-white flex items-center justify-center shadow-md">
              <Radio size={16} />
            </span>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-accent)] block">
                LectureAI Podcast Network
              </span>
              <h3 className="text-sm font-bold text-[var(--color-primary)] leading-tight">
                3-Minute Audio Briefing
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Playing Indicator */}
            {isPlaying && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold animate-pulse border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ON AIR
              </span>
            )}
            <span className="text-xs font-mono text-[var(--color-secondary)] flex items-center gap-1">
              <Clock size={12} /> ~3:20
            </span>
          </div>
        </div>

        {/* Lesson Metadata */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-[var(--color-primary)]">
            Lesson {lectureNumber}: {curriculum?.title || lectureTitle}
          </h2>
          <p className="text-xs text-[var(--color-secondary)] mt-1 line-clamp-2">
            Executive conversational audio recap covering architecture, code patterns, and gotchas.
          </p>
        </div>

        {/* Animated Equalizer Waveform Visualizer */}
        <div className="flex items-center justify-center gap-1 h-12 my-2 py-1 bg-black/20 rounded-xl px-4 border border-white/5">
          {[12, 28, 45, 18, 38, 52, 24, 40, 16, 48, 30, 15, 35, 50, 22, 42, 28, 14].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-200 ${
                isPlaying
                  ? 'bg-gradient-to-t from-[var(--color-accent)] to-emerald-300'
                  : 'bg-[var(--color-secondary)] opacity-30'
              }`}
              style={{
                height: isPlaying ? `${Math.max(8, (h * ((i % 3) + 1.2)) % 44)}px` : '6px',
                transitionDelay: `${i * 30}ms`,
              }}
            />
          ))}
        </div>

        {/* Primary Audio Transport Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[var(--color-border)]/50">
          <div className="flex items-center gap-3">
            {/* Prev Chapter */}
            <button
              onClick={handleSkipPrev}
              disabled={activeChapterIndex === 0}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer transition-all"
              title="Previous Chapter"
            >
              <Rewind size={15} />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-2xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}
            </button>

            {/* Next Chapter */}
            <button
              onClick={handleSkipNext}
              disabled={activeChapterIndex === chapters.length - 1}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer transition-all"
              title="Next Chapter"
            >
              <FastForward size={15} />
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] cursor-pointer transition-all"
              title="Restart from beginning"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-1 text-[11px] font-semibold">
              {[1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-[var(--color-accent)] text-white shadow-sm'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Mute toggle */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (utteranceRef.current) {
                  utteranceRef.current.volume = nextMute ? 0 : 1;
                }
              }}
              className="p-2 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] cursor-pointer"
            >
              {isMuted ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Voice & Speaker Settings */}
      {voices.length > 0 && (
        <div className="p-3.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-[var(--color-secondary)] flex items-center gap-1.5 shrink-0">
            <Radio size={13} className="text-[var(--color-accent)]" /> AI Voice Narrator:
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

      {/* Chapter Breakdown & Live Script */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">
            Podcast Episode Chapters
          </h4>
          <span className="text-[11px] text-[var(--color-secondary)]">
            Chapter {activeChapterIndex + 1} of {chapters.length}
          </span>
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
                    ? 'bg-[var(--color-background)] border-[var(--color-accent)] shadow-md'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-background)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCurrent
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary)]'
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {idx + 1}. {ch.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[var(--color-secondary)]">
                      {ch.duration}
                    </span>
                    {isCurrent && isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ) : (
                      <Play size={11} className="text-[var(--color-secondary)]" />
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
