import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronRight, Download, Loader2, Trash2, Sparkles, ListVideo, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import type { Lecture, TranscriptChunk, Source } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import AIChat from '../components/AIChat';
import TranscriptViewer from '../components/TranscriptViewer';
import LoadingState from '../components/LoadingState';
import { useHistory } from '../hooks/useHistory';
import { useBookmarks } from '../hooks/useBookmarks';
import { formatDuration } from '../utils/formatTime';
import { generateLecturePdfSummary } from '../utils/generatePdfSummary';
import { customLectureStorage } from '../services/customLectureStorage';
import { courseStorage } from '../services/courseStorage';

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
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'transcript'>(
    searchParams.get('ask') === 'true' ? 'ai' : 'ai'
  );

  const { addToHistory } = useHistory();
  const { addBookmark, isBookmarked } = useBookmarks();

  // Course & Playlist sequence mapping
  const courseData = isCustom && number ? courseStorage.getCourseForLecture(number) : null;
  const isCoreCourse = !isCustom && number && !isNaN(parseInt(number, 10));
  const coreNum = isCoreCourse ? parseInt(number, 10) : 0;

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

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
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

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="btn-secondary text-xs font-medium flex items-center justify-center gap-2 py-2 px-3 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer shadow-sm"
              title="Download structured AI study summary PDF of this lecture"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[var(--color-accent)]" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={14} className="text-[var(--color-accent)]" />
                  <span>Download Master Study Guide (PDF)</span>
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
            {prevLecturePath ? (
              <Link
                to={prevLecturePath}
                className="px-2.5 py-1 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1 text-[11px] no-underline"
              >
                <ChevronLeft size={13} />
                <span>Previous Lesson</span>
              </Link>
            ) : (
              <span className="px-2.5 py-1 text-[11px] text-[var(--color-secondary)] opacity-40 flex items-center gap-1 cursor-not-allowed">
                <ChevronLeft size={13} /> Previous
              </span>
            )}

            {nextLecturePath ? (
              <Link
                to={nextLecturePath}
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

        {/* Right: AI Chat + Transcript tabs (on smaller screens) */}
        <div className="lg:w-[40%] border-l border-[var(--color-border)] flex flex-col" style={{ height: 'calc(100vh - 73px)' }}>
          {/* Tab bar for mobile */}
          <div className="lg:hidden flex border-b border-[var(--color-border)]">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === 'ai'
                  ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                  : 'text-[var(--color-secondary)]'
              }`}
            >
              Ask AI
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === 'transcript'
                  ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                  : 'text-[var(--color-secondary)]'
              }`}
            >
              Transcript
            </button>
          </div>

          {/* AI Chat (always visible on desktop, tab on mobile) */}
          <div className={`flex-1 overflow-hidden ${activeTab !== 'ai' ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
            <AIChat
              lectureNumber={number}
              onSeek={handleSeek}
              onAddToHistory={handleAddToHistory}
              onBookmarkSource={handleBookmarkSource}
              isSourceBookmarked={(num, start) => isBookmarked(num, start)}
            />
          </div>

          {/* Transcript tab for mobile */}
          <div className={`flex-1 overflow-hidden lg:hidden ${activeTab !== 'transcript' ? 'hidden' : 'flex flex-col'}`}>
            <TranscriptViewer
              chunks={chunks}
              currentTime={currentTime}
              onSeek={handleSeek}
              highlightedStart={highlightedStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
