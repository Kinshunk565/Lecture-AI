import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Trash2,
  ListVideo,
  ChevronDown,
  CheckCircle2,
  Circle,
  Radio,
  Columns,
  Maximize2,
  Minimize2,
  Tv,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Code2,
  Network,
  PenTool,
} from 'lucide-react';
import { api } from '../services/api';
import type { Lecture, TranscriptChunk, Source } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import AIChat from '../components/AIChat';
import TranscriptViewer from '../components/TranscriptViewer';
import LoadingState from '../components/LoadingState';
import InteractiveQuiz from '../components/InteractiveQuiz';
import CodePlayground from '../components/CodePlayground';
import ConceptGraph from '../components/ConceptGraph';
import LectureNotes from '../components/LectureNotes';
import AudioPodcastBriefing from '../components/AudioPodcastBriefing';
import { useHistory } from '../hooks/useHistory';
import { useBookmarks } from '../hooks/useBookmarks';
import { formatDuration } from '../utils/formatTime';
import { generateLecturePdfSummary, generateCoursePdfSummary } from '../utils/generatePdfSummary';
import { customLectureStorage } from '../services/customLectureStorage';
import { courseStorage } from '../services/courseStorage';
import { LECTURE_CURRICULUM } from '../data/lectureCurriculum';
import { FALLBACK_LECTURES } from '../data/fallbackLectures';

type WorkbenchTab = 'ai' | 'quiz' | 'code' | 'mindmap' | 'notes' | 'podcast' | 'transcript';
type StudioMode = 'balanced' | 'focus' | 'theater';

export default function LectureDetail() {
  const { number } = useParams<{ number: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCustom = number?.startsWith('custom-');

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [chunks, setChunks] = useState<TranscriptChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightedStart, setHighlightedStart] = useState<number | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingCoursePdf, setIsDownloadingCoursePdf] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [studioMode, setStudioMode] = useState<StudioMode>('balanced');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkbenchTab>(() => {
    if (searchParams.get('ask') === 'true') return 'ai';
    const tabParam = searchParams.get('tab') as WorkbenchTab;
    if (['ai', 'quiz', 'code', 'mindmap', 'notes', 'podcast', 'transcript'].includes(tabParam)) {
      return tabParam;
    }
    return 'ai';
  });

  const { addToHistory } = useHistory();
  const { addBookmark, isBookmarked } = useBookmarks();

  const cleanNum = isCustom && number ? number : String(parseInt(number || '1', 10) || '1');
  const curriculum = isCustom && number
    ? (customLectureStorage.getCustomLecture(number)?.curriculum || null)
    : (LECTURE_CURRICULUM[cleanNum] || null);

  // Course & Playlist sequence mapping
  const courseData = isCustom && number ? courseStorage.getCourseForLecture(number) : null;
  const isCoreCourse = !isCustom && number && !isNaN(parseInt(number, 10));
  const coreNum = isCoreCourse ? parseInt(number, 10) : 0;

  useEffect(() => {
    if (number) {
      setIsCompleted(courseStorage.isLessonCompleted(number));
    }
  }, [number]);

  const prevLecturePath = courseData
    ? (courseData.index > 0 ? `/lectures/${courseData.course.lectures[courseData.index - 1].number}` : null)
    : (coreNum > 1 ? `/lectures/${coreNum - 1}` : null);

  const nextLecturePath = courseData
    ? (courseData.index < courseData.course.totalLectures - 1 ? `/lectures/${courseData.course.lectures[courseData.index + 1].number}` : null)
    : (coreNum < 18 ? `/lectures/${coreNum + 1}` : null);

  const courseTitle = courseData
    ? courseData.course.title
    : (isCoreCourse ? 'Sigma Web Development Course' : 'Video Lecture');

  const courseProgressText = courseData
    ? `Lesson ${courseData.index + 1} of ${courseData.course.totalLectures}`
    : (isCoreCourse ? `Lesson ${coreNum} of 18` : null);

  const playlistLectures = courseData
    ? courseData.course.lectures
    : (isCoreCourse
        ? FALLBACK_LECTURES.map((l) => ({
            number: l.number,
            title: l.title,
            duration: l.duration,
          }))
        : []);

  const handleToggleCompleted = useCallback(() => {
    if (!number) return;
    const next = courseStorage.toggleLessonCompleted(number);
    setIsCompleted(next);
  }, [number]);


  const handleDeleteCustom = useCallback(() => {
    if (!number) return;
    if (window.confirm('Are you sure you want to remove this custom video and its notes?')) {
      customLectureStorage.deleteCustomLecture(number);
      navigate('/lectures');
    }
  }, [number, navigate]);

  useEffect(() => {
    if (!number) return;
    async function load() {
      try {
        const [lectureData, transcriptData] = await Promise.all([
          api.getLecture(number!),
          api.getTranscript(number!),
        ]);
        setLecture(lectureData);
        setChunks(transcriptData.chunks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [number]);

  const handleSeek = useCallback((time: number) => {
    setSeekTo(time);
    setHighlightedStart(time);
    // Reset seekTo after a tick so re-clicking same timestamp works
    setTimeout(() => setSeekTo(null), 100);
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleAddToHistory = useCallback((question: string, answer: string, sources: Source[]) => {
    addToHistory({
      question,
      answer,
      sources,
      lectureNumber: number,
      lectureTitle: lecture?.title,
    });
  }, [addToHistory, number, lecture]);

  const handleBookmarkSource = useCallback((source: Source) => {
    addBookmark({
      lectureNumber: source.number,
      lectureTitle: source.title,
      start: source.start,
      end: source.end,
      text: source.text,
      type: 'timestamp',
    });
  }, [addBookmark]);

  const handleDownloadPdf = useCallback(async () => {
    if (!lecture) return;
    try {
      setIsDownloadingPdf(true);
      await generateLecturePdfSummary(lecture, chunks);
    } catch (err) {
      console.error('Failed to generate summary PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  }, [lecture, chunks]);

  const handleDownloadCoursePdf = useCallback(async () => {
    try {
      setIsDownloadingCoursePdf(true);
      if (courseData) {
        await generateCoursePdfSummary(
          courseData.course.title,
          courseData.course.instructor,
          courseData.course.lectures
        );
      } else if (isCoreCourse) {
        const res = await api.getLectures();
        const coreLessons = (res.lectures || []).map((l: Lecture) => ({
          number: l.number,
          title: l.title,
          duration: l.duration,
        }));
        await generateCoursePdfSummary(
          'Sigma Web Development Course',
          'CodeWithHarry',
          coreLessons
        );
      }

    } catch (err) {
      console.error('Failed to generate course syllabus PDF:', err);
    } finally {
      setIsDownloadingCoursePdf(false);
    }
  }, [courseData, isCoreCourse]);

  if (loading) return <LoadingState message="Loading lecture..." />;
  if (error || !lecture) {
    return (
      <div className="p-8 text-center py-20">
        <p className="text-sm text-[var(--color-error)]">{error || 'Lecture not found'}</p>
        <Link to="/lectures" className="btn-secondary mt-4 inline-flex">
          <ChevronLeft size={14} /> Back to lectures
        </Link>
      </div>
    );
  }

  const videoSrc = lecture.video_file ? api.getVideoUrl(lecture.video_file) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[var(--color-background)] overflow-hidden">
      {/* Consolidated Studio Top Bar (Single Sleek Bar) */}
      <header className="h-14 px-3 sm:px-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Left: Navigation, Title & Playlist Drawer */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            to="/lectures"
            className="p-1.5 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors shrink-0"
            title="Back to lectures"
          >
            <ChevronLeft size={18} />
          </Link>

          <span className="px-2 py-0.5 rounded-md bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-mono font-bold text-xs shrink-0">
            {isCustom ? 'Custom' : `L${lecture.number}`}
          </span>

          <div className="flex flex-col min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-[var(--color-primary)] truncate max-w-[140px] sm:max-w-xs md:max-w-sm" title={lecture.title}>
              {lecture.title}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-secondary)] truncate">
              <span>{courseProgressText || courseTitle}</span>
              {lecture.duration > 0 && (
                <>
                  <span>·</span>
                  <span>{formatDuration(lecture.duration)}</span>
                </>
              )}
            </div>
          </div>

          {/* Playlist Drawer Dropdown */}
          {playlistLectures.length > 0 && (
            <div className="relative shrink-0 hidden sm:block">
              <button
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-primary)] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <ListVideo size={13} className="text-[var(--color-accent)]" />
                <span>{playlistLectures.length} Lessons</span>
                <ChevronDown size={12} className={`transform transition-transform ${isPlaylistOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPlaylistOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 max-h-80 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider font-bold text-[var(--color-secondary)] border-b border-[var(--color-border)]">
                    {courseTitle}
                  </div>
                  {playlistLectures.map((item, idx) => {
                    const isDone = courseStorage.isLessonCompleted(item.number);
                    const isSelected = item.number === number;
                    return (
                      <Link
                        key={item.number}
                        to={`/lectures/${item.number}`}
                        onClick={() => setIsPlaylistOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs no-underline transition-colors ${
                          isSelected
                            ? 'bg-[var(--color-accent)] text-white font-semibold shadow-xs'
                            : 'text-[var(--color-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isDone ? (
                            <CheckCircle2 size={13} className={isSelected ? 'text-white' : 'text-emerald-500'} />
                          ) : (
                            <Circle size={13} className="opacity-40" />
                          )}
                          <span className="truncate">L{idx + 1}: {item.title}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-80 shrink-0 ml-2">{formatDuration(item.duration)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Studio Workspace View Switcher */}
        <div className="hidden md:flex items-center p-0.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] text-xs font-semibold">
          <button
            onClick={() => setStudioMode('balanced')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              studioMode === 'balanced'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
            title="Side-by-side Video and Learning Tools"
          >
            <Columns size={13} />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setStudioMode('focus')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              studioMode === 'focus'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
            title="Maximize Learning Tools (Full Width Sandbox, Mind Map, Quiz, Podcast)"
          >
            <Maximize2 size={13} />
            <span>Focus Tools</span>
          </button>
          <button
            onClick={() => setStudioMode('theater')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              studioMode === 'theater'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-xs'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
            title="Theater Mode (Maximize Video Player)"
          >
            <Tv size={13} />
            <span>Theater</span>
          </button>
        </div>

        {/* Right: Actions, Completion, Nav & PDF Export */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mark Complete */}
          <button
            onClick={handleToggleCompleted}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
            title={isCompleted ? 'Marked as completed' : 'Mark lesson as completed'}
          >
            <CheckCircle2 size={13} className={isCompleted ? 'text-emerald-500' : ''} />
            <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Complete'}</span>
          </button>

          {/* Prev / Next Chevrons */}
          <div className="flex items-center bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-0.5 shadow-xs">
            {prevLecturePath ? (
              <Link
                to={prevLecturePath}
                className="p-1 rounded text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all"
                title="Previous Lesson"
              >
                <ChevronLeft size={14} />
              </Link>
            ) : (
              <span className="p-1 text-[var(--color-secondary)] opacity-30 cursor-not-allowed">
                <ChevronLeft size={14} />
              </span>
            )}
            <div className="w-[1px] h-3 bg-[var(--color-border)] my-auto" />
            {nextLecturePath ? (
              <Link
                to={nextLecturePath}
                onClick={() => {
                  if (number) courseStorage.markLessonCompleted(number, true);
                }}
                className="p-1 rounded text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all"
                title="Next Lesson"
              >
                <ChevronRight size={14} />
              </Link>
            ) : (
              <span className="p-1 text-[var(--color-secondary)] opacity-30 cursor-not-allowed">
                <ChevronRight size={14} />
              </span>
            )}
          </div>

          {/* PDF Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isDownloadingPdf || isDownloadingCoursePdf}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-primary)] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Download structured AI summary PDFs"
            >
              {isDownloadingPdf || isDownloadingCoursePdf ? (
                <Loader2 size={13} className="animate-spin text-[var(--color-accent)]" />
              ) : (
                <Download size={13} className="text-[var(--color-accent)]" />
              )}
              <span className="hidden md:inline">Export</span>
              <ChevronDown size={11} className={`transform transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleDownloadPdf();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[var(--color-background)] text-[var(--color-primary)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText size={14} className="text-[var(--color-accent)]" />
                  <div>
                    <span className="font-semibold block">Lesson Summary (PDF)</span>
                    <span className="text-[10px] text-[var(--color-secondary)]">Notes, code & interview quiz</span>
                  </div>
                </button>

                {(courseData || isCoreCourse) && (
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleDownloadCoursePdf();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[var(--color-background)] text-[var(--color-primary)] flex items-center gap-2 cursor-pointer transition-colors border-t border-[var(--color-border)]/50 pt-2"
                  >
                    <BookOpen size={14} className="text-[var(--color-accent)]" />
                    <div>
                      <span className="font-semibold block">Full Course Syllabus (PDF)</span>
                      <span className="text-[10px] text-[var(--color-secondary)]">Complete multi-lesson guide</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Delete custom video */}
          {isCustom && (
            <button
              onClick={handleDeleteCustom}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Remove this video"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Studio Workspace Body */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left Column: Video & Transcript Player Pane */}
        {studioMode !== 'focus' && (
          <div
            className={`flex flex-col h-full overflow-y-auto ${
              studioMode === 'theater'
                ? 'w-full bg-black/95 p-4 sm:p-8 flex items-center justify-center'
                : 'lg:w-[48%] xl:w-[46%] border-r border-[var(--color-border)] bg-[var(--color-background)]'
            }`}
          >
            <div className={studioMode === 'theater' ? 'w-full max-w-5xl space-y-4' : 'p-3 sm:p-4'}>
              {studioMode === 'theater' && (
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono font-bold">Theater Mode</span>
                    <span className="text-xs text-white/70">{lecture.title}</span>
                  </div>
                  <button
                    onClick={() => setStudioMode('balanced')}
                    className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Columns size={13} />
                    <span>Exit Theater</span>
                  </button>
                </div>
              )}

              <VideoPlayer
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                seekTo={seekTo}
                lectureTitle={lecture.title}
                lectureNumber={lecture.number}
              />
            </div>

            {/* Transcript (shown below video in balanced mode on desktop) */}
            {studioMode === 'balanced' && (
              <div className="hidden lg:flex flex-1 border-t border-[var(--color-border)] flex-col min-h-[350px]">
                <TranscriptViewer
                  chunks={chunks}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  highlightedStart={highlightedStart}
                />
              </div>
            )}
          </div>
        )}

        {/* Floating Mini Player when in Focus Mode (So user never loses the video) */}
        {studioMode === 'focus' && (
          <div className="fixed bottom-4 left-4 lg:left-64 z-40 w-72 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden p-2 space-y-2 animate-slide-up">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] flex items-center gap-1">
                <Tv size={11} className="text-[var(--color-accent)]" /> Video Mini Player
              </span>
              <button
                onClick={() => setStudioMode('balanced')}
                className="text-[10px] text-[var(--color-accent)] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                title="Restore side-by-side view"
              >
                <span>Restore</span>
                <Columns size={10} />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-black">
              <VideoPlayer
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                seekTo={seekTo}
                lectureTitle={lecture.title}
                lectureNumber={lecture.number}
              />
            </div>
          </div>
        )}

        {/* Right Column: Multi-Tool Learning Workbench */}
        {studioMode !== 'theater' && (
          <div
            className={`h-full flex flex-col bg-[var(--color-surface)] overflow-hidden ${
              studioMode === 'focus' ? 'w-full' : 'lg:w-[52%] xl:w-[54%]'
            }`}
          >
            {/* Workbench Segmented Tab Bar */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 overflow-x-auto no-scrollbar gap-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'ai'
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => setActiveTab('podcast')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'podcast'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-600 dark:text-purple-400 hover:bg-purple-500/10'
                  }`}
                >
                  <Radio size={13} className={activeTab === 'podcast' ? 'animate-pulse' : ''} />
                  <span>Podcast</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${activeTab === 'podcast' ? 'bg-purple-700 text-white' : 'bg-purple-500/15 text-purple-600'}`}>
                    3-min
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <HelpCircle size={13} />
                  <span>Quiz & Cards</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <Code2 size={13} />
                  <span>Playground</span>
                </button>

                <button
                  onClick={() => setActiveTab('mindmap')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'mindmap'
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <Network size={13} />
                  <span>Mind Map</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <PenTool size={13} />
                  <span>Notes</span>
                </button>

                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`lg:hidden px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'transcript'
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <FileText size={13} />
                  <span>Transcript</span>
                </button>
              </div>

              {/* Expand / Minimize Workbench Toggle */}
              <div className="hidden lg:flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setStudioMode(studioMode === 'focus' ? 'balanced' : 'focus')}
                  className="p-1.5 rounded-lg text-[var(--color-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
                  title={studioMode === 'focus' ? 'Restore side-by-side view' : 'Maximize Workbench'}
                >
                  {studioMode === 'focus' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              </div>
            </div>

            {/* Workbench Tab Contents */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'ai' && (
                <AIChat
                  lectureNumber={number}
                  onSeek={handleSeek}
                  onAddToHistory={handleAddToHistory}
                  onBookmarkSource={handleBookmarkSource}
                  isSourceBookmarked={(num, start) => isBookmarked(num, start)}
                />
              )}

              {activeTab === 'podcast' && (
                <AudioPodcastBriefing
                  lectureNumber={number!}
                  lectureTitle={lecture.title}
                  curriculum={curriculum}
                />
              )}

              {activeTab === 'quiz' && (
                <InteractiveQuiz
                  lectureNumber={number!}
                  curriculum={curriculum}
                  onSeek={handleSeek}
                />
              )}

              {activeTab === 'code' && (
                <CodePlayground
                  lectureNumber={number!}
                  curriculum={curriculum}
                />
              )}

              {activeTab === 'mindmap' && (
                <ConceptGraph
                  lectureNumber={number!}
                  curriculum={curriculum}
                  onSeek={handleSeek}
                />
              )}

              {activeTab === 'notes' && (
                <LectureNotes
                  lectureNumber={number!}
                  lectureTitle={lecture.title}
                  currentTime={currentTime}
                  curriculum={curriculum}
                  onSeek={handleSeek}
                />
              )}

              {activeTab === 'transcript' && (
                <TranscriptViewer
                  chunks={chunks}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  highlightedStart={highlightedStart}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

