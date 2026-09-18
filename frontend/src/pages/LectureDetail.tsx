import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Trash2,
  Sparkles,
  ListVideo,
  ChevronDown,
  CheckCircle2,
  Circle,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Code2,
  Network,
  PenTool,
  Radio,
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

type WorkbenchTab = 'ai' | 'quiz' | 'code' | 'mindmap' | 'notes' | 'podcast' | 'transcript';

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

  const playlistLectures = courseData ? courseData.course.lectures : [];

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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/lectures" className="text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-[var(--color-primary)] tracking-tight">
                {lecture.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[var(--color-secondary)]">
                {isCustom ? (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-semibold text-[11px] flex items-center gap-1">
                    <Sparkles size={11} /> Custom Video
                  </span>
                ) : (
                  <span>Video {lecture.number}</span>
                )}
                <span>·</span>
                <span className="flex items-center gap-1"><FileText size={11} /> {lecture.chunk_count} segments</span>
                {lecture.duration > 0 && (
                  <>
                    <span>·</span>
                    <span>{formatDuration(lecture.duration)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {isCustom && (
              <button
                onClick={handleDeleteCustom}
                className="btn-secondary text-xs font-medium flex items-center justify-center gap-1.5 py-2 px-3 text-red-400 hover:text-red-300 hover:border-red-500/40 transition-all cursor-pointer shadow-sm"
                title="Remove this imported video"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            )}

            {/* Download Course Syllabus PDF Button (if part of course) */}
            {(courseData || isCoreCourse) && (
              <button
                onClick={handleDownloadCoursePdf}
                disabled={isDownloadingCoursePdf}
                className="btn-secondary text-xs font-medium flex items-center justify-center gap-1.5 py-2 px-3 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer shadow-sm"
                title="Download full course syllabus & study guide containing all lessons"
              >
                {isDownloadingCoursePdf ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[var(--color-accent)]" />
                    <span>Generating Course PDF...</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={13} className="text-[var(--color-accent)]" />
                    <span>Course Syllabus (PDF)</span>
                  </>
                )}
              </button>
            )}

            {/* Quick 3-Min Podcast Briefing Button */}
            <button
              onClick={() => setActiveTab('podcast')}
              className={`btn-secondary text-xs font-medium flex items-center justify-center gap-1.5 py-2 px-3 transition-all cursor-pointer shadow-sm ${
                activeTab === 'podcast'
                  ? 'border-purple-500/60 text-purple-400 bg-purple-500/10'
                  : 'hover:border-purple-500/50 hover:text-purple-300'
              }`}
              title="Listen to 3-minute conversational audio briefing of this lecture"
            >
              <Radio size={13} className="text-purple-400 animate-pulse" />
              <span>🎙️ 3-Min Podcast</span>
            </button>

            {/* Download Lesson PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="btn-secondary text-xs font-medium flex items-center justify-center gap-1.5 py-2 px-3 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer shadow-sm"
              title="Download structured AI study summary PDF of this lecture"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 size={13} className="animate-spin text-[var(--color-accent)]" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={13} className="text-[var(--color-accent)]" />
                  <span>Lesson Guide (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Course & Playlist Navigation Ribbon */}
      {(courseProgressText || playlistLectures.length > 0) && (
        <div className="px-6 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-primary)] flex items-center gap-1.5">
              <ListVideo size={14} className="text-[var(--color-accent)]" />
              {courseTitle}
            </span>
            {courseProgressText && (
              <span className="px-2 py-0.5 rounded-md bg-[var(--color-background)] text-[var(--color-secondary)] font-mono text-[11px] border border-[var(--color-border)]">
                {courseProgressText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mark Lesson Completed Toggle */}
            <button
              onClick={handleToggleCompleted}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] font-medium cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
              }`}
              title="Mark lesson completed"
            >
              {isCompleted ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} />}
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            {prevLecturePath ? (
              <Link
                to={prevLecturePath}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1 text-[11px] no-underline"
              >
                <ChevronLeft size={13} />
                <span>Previous</span>
              </Link>
            ) : (
              <span className="px-2.5 py-1 text-[11px] text-[var(--color-secondary)] opacity-40 flex items-center gap-1 cursor-not-allowed">
                <ChevronLeft size={13} /> Previous
              </span>
            )}

            {nextLecturePath ? (
              <Link
                to={nextLecturePath}
                onClick={() => {
                  if (number) courseStorage.markLessonCompleted(number, true);
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1 text-[11px] no-underline font-medium"
              >
                <span>Next Lesson</span>
                <ChevronRight size={13} />
              </Link>
            ) : (
              <span className="px-2.5 py-1 text-[11px] text-[var(--color-secondary)] opacity-40 flex items-center gap-1 cursor-not-allowed">
                Next <ChevronRight size={13} />
              </span>
            )}


            {playlistLectures.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-all flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                >
                  <span>Playlist ({playlistLectures.length})</span>
                  <ChevronDown size={12} className={`transform transition-transform ${isPlaylistOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPlaylistOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-72 max-h-80 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                    {playlistLectures.map((item, idx) => (
                      <Link
                        key={item.number}
                        to={`/lectures/${item.number}`}
                        onClick={() => setIsPlaylistOpen(false)}
                        className={`block p-2 rounded-lg text-[11px] no-underline transition-colors ${
                          item.number === number
                            ? 'bg-[var(--color-accent)] text-white font-medium'
                            : 'text-[var(--color-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <span className="font-semibold block truncate">Lesson {idx + 1}: {item.title}</span>
                        <span className="text-[10px] opacity-80 block">{formatDuration(item.duration)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left: Video */}
        <div className="flex-1 lg:max-w-[60%]">
          <div className="p-4">
            <VideoPlayer
              src={videoSrc}
              onTimeUpdate={handleTimeUpdate}
              seekTo={seekTo}
              lectureTitle={lecture.title}
              lectureNumber={lecture.number}
            />
          </div>

          {/* Transcript (desktop - below video) */}
          <div className="hidden lg:block border-t border-[var(--color-border)]" style={{ height: '400px' }}>
            <TranscriptViewer
              chunks={chunks}
              currentTime={currentTime}
              onSeek={handleSeek}
              highlightedStart={highlightedStart}
            />
          </div>
        </div>

        {/* Right: Multi-Tool Learning Workbench */}
        <div className="lg:w-[40%] border-l border-[var(--color-border)] flex flex-col bg-[var(--color-surface)]" style={{ height: 'calc(100vh - 73px)' }}>
          {/* Workbench Tab Bar */}
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-background)]/80 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'ai'
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <MessageSquare size={13} />
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'quiz'
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <HelpCircle size={13} />
              <span>Quiz & Cards</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'code'
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <Code2 size={13} />
              <span>Playground</span>
            </button>
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'mindmap'
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <Network size={13} />
              <span>Mind Map</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'notes'
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <PenTool size={13} />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('podcast')}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'podcast'
                  ? 'text-purple-400 border-purple-500 bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <Radio size={13} className={activeTab === 'podcast' ? 'text-purple-400' : ''} />
              <span>Podcast</span>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`lg:hidden px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                activeTab === 'transcript'
                  ? 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-surface)]'
                  : 'text-[var(--color-secondary)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              <FileText size={13} />
              <span>Transcript</span>
            </button>
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

            {activeTab === 'podcast' && (
              <AudioPodcastBriefing
                lectureNumber={number!}
                lectureTitle={lecture.title}
                curriculum={curriculum}
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
      </div>
    </div>
  );
}

