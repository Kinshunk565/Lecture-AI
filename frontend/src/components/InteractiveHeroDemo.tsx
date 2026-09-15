import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Sparkles, Clock, CheckCircle2, Volume2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DemoQuestion {
  question: string;
  answer: string;
  lectureTitle: string;
  sources: {
    time: string;
    seconds: number;
    title: string;
    snippet: string;
  }[];
}

const DEMO_PRESETS: DemoQuestion[] = [
  {
    question: "What is CSS and how does it work with HTML?",
    answer: "CSS (Cascading Style Sheets) styles the presentation of web pages. While HTML provides the skeleton and structural elements of a site, CSS controls colors, layouts, fonts, and responsive positioning. CSS uses selectors to target HTML elements and applies declarations (property-value pairs) to style them.",
    lectureTitle: "Video 14 · Introduction to CSS",
    sources: [
      {
        time: "0:21",
        seconds: 21,
        title: "CSS definition & purpose",
        snippet: "CSS stands for Cascading Style Sheets. We supplement HTML with some styles...",
      },
      {
        time: "1:31",
        seconds: 91,
        title: "HTML as skeleton vs CSS as styling",
        snippet: "If HTML is the body or skeleton of a car, then CSS is the paint, decoration, and interior design...",
      },
      {
        time: "4:44",
        seconds: 284,
        title: "Selectors & Declarations explained",
        snippet: "This is a selector and this is our declaration. Selector specifies which element, declaration sets the property...",
      },
    ],
  },
  {
    question: "What is the basic structure of an HTML document?",
    answer: "An HTML document begins with <!DOCTYPE html> to declare the HTML5 document type, followed by the <html> root element. Inside are two main sections: <head> containing metadata, title, and stylesheets, and <body> containing all visible content rendered on the page.",
    lectureTitle: "Video 03 · Basic Structure of an HTML Website",
    sources: [
      {
        time: "0:45",
        seconds: 45,
        title: "Doctype and html root tag",
        snippet: "Every HTML5 document starts with the doctype declaration telling the browser the format...",
      },
      {
        time: "2:10",
        seconds: 130,
        title: "Head vs Body tag roles",
        snippet: "The head tag stores metadata, charset, and title, while the body tag contains everything user sees...",
      },
    ],
  },
];

export default function InteractiveHeroDemo() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [seekSeconds, setSeekSeconds] = useState(21);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoTour, setAutoTour] = useState(false);
  const [activeTimeDisplay, setActiveTimeDisplay] = useState("0:21");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentData = DEMO_PRESETS[selectedPreset];

  // Jump video to timestamp
  const jumpToSource = (index: number) => {
    const src = currentData.sources[index];
    setActiveSourceIndex(index);
    setSeekSeconds(src.seconds);
    setActiveTimeDisplay(src.time);
    setIsPlaying(true);
  };

  // Switch question
  const selectQuestion = (presetIndex: number) => {
    setSelectedPreset(presetIndex);
    setActiveSourceIndex(0);
    const initialSrc = DEMO_PRESETS[presetIndex].sources[0];
    setSeekSeconds(initialSrc.seconds);
    setActiveTimeDisplay(initialSrc.time);
  };

  // Auto tour effect
  useEffect(() => {
    if (!autoTour) return;

    const interval = setInterval(() => {
      setActiveSourceIndex((prev) => {
        const next = (prev + 1) % currentData.sources.length;
        const src = currentData.sources[next];
        setSeekSeconds(src.seconds);
        setActiveTimeDisplay(src.time);
        return next;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [autoTour, currentData.sources]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
      {/* Interactive Demo Header Bar */}
      <div className="px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-[var(--color-secondary)] pl-2 border-l border-[var(--color-border)]">
            lecture-ai · interactive video preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Timestamp Sync
          </span>

          <button
            onClick={() => setAutoTour(!autoTour)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 ${
              autoTour
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] border-[var(--color-border)]'
            }`}
          >
            {autoTour ? <Pause size={12} /> : <Sparkles size={12} />}
            {autoTour ? 'Pause Tour' : 'Auto Tour'}
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Video + AI Assistant */}
      <div className="grid lg:grid-cols-12 gap-0">
        {/* Left / Top Column: Live Video Player */}
        <div className="lg:col-span-7 bg-black flex flex-col justify-between relative group">
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/Edsxf_NBFrw?start=${seekSeconds}&autoplay=${isPlaying ? 1 : 0}&mute=1&controls=1&modestbranding=1&rel=0`}
              title="Lecture Video Stream"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Current Sync Badge Overlay */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs flex items-center gap-2 pointer-events-none">
              <Clock size={12} className="text-[var(--color-accent)] animate-spin-slow" />
              <span className="font-mono font-medium">{activeTimeDisplay}</span>
              <span className="text-white/40">|</span>
              <span className="truncate max-w-[180px] text-white/90 font-sans">
                {currentData.sources[activeSourceIndex]?.title || 'Playing segment'}
              </span>
            </div>
          </div>

          {/* Player status strip */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Volume2 size={14} className="text-zinc-500" />
              <span className="truncate text-zinc-300 font-medium">{currentData.lectureTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                Seeking: {activeTimeDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Right / Bottom Column: Grounded AI Assistant Response */}
        <div className="lg:col-span-5 p-5 md:p-6 flex flex-col justify-between bg-[var(--color-surface)] border-t lg:border-t-0 lg:border-l border-[var(--color-border)]">
          <div>
            {/* Question Selector Tabs */}
            <div className="flex items-center gap-1 mb-4 p-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
              {DEMO_PRESETS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectQuestion(idx)}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all truncate text-center ${
                    selectedPreset === idx
                      ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm border border-[var(--color-border)]'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {idx === 0 ? 'CSS Overview' : 'HTML Structure'}
                </button>
              ))}
            </div>

            {/* Prompt Display */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)] mb-1 block">
                Student Question
              </span>
              <div className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-xs md:text-sm font-medium text-[var(--color-primary)]">
                "{currentData.question}"
              </div>
            </div>

            {/* Grounded Answer */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[var(--color-accent)]" />
                  Grounded AI Answer
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  98% Grounded
                </span>
              </div>
              <p className="text-xs text-[var(--color-primary)] leading-relaxed p-3.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
                {currentData.answer}
              </p>
            </div>

            {/* Interactive Sources List with Click-to-Seek */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                  Click Citation to Seek Video
                </span>
                <span className="text-[10px] text-[var(--color-secondary)]">
                  {currentData.sources.length} citations
                </span>
              </div>

              <div className="space-y-2">
                {currentData.sources.map((src, i) => {
                  const isActive = activeSourceIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => jumpToSource(i)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)] shadow-sm'
                          : 'border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isActive
                            ? 'bg-[var(--color-accent)] text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-secondary)]'
                        }`}
                      >
                        <Play size={10} className="ml-0.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'
                            }`}
                          >
                            {src.title}
                          </p>
                          <span
                            className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isActive
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-secondary)]'
                            }`}
                          >
                            {src.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-secondary)] line-clamp-1">
                          {src.snippet}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--color-secondary)] flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Verified with Whisper + BGE-M3
            </span>
            <Link
              to="/lectures"
              className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1"
            >
              Try with your lectures <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
