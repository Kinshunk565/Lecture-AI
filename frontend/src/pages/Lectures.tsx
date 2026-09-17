import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Lecture } from '../types';
import { FALLBACK_LECTURES } from '../data/fallbackLectures';
import LectureCard from '../components/LectureCard';
import ImportVideoModal from '../components/ImportVideoModal';
import { courseStorage, type CourseItem } from '../services/courseStorage';
import { Search, Plus, Sparkles, BookOpen, Layers, ListVideo, Play, Trash2 } from 'lucide-react';

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>(FALLBACK_LECTURES);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'playlists' | 'all' | 'custom' | 'course'>('playlists');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const loadData = () => {
    api.getLectures()
      .then((res) => {
        if (res.lectures && res.lectures.length > 0) {
          setLectures(res.lectures);
        }
      })
      .catch(() => {});

    setCourses(courseStorage.getCourses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCourse = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the full course "${title}" and all its lessons?`)) {
      courseStorage.deleteCourse(id);
      loadData();
    }
  };

  const customCount = lectures.filter((l) => l.number.startsWith('custom-')).length;

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(filter.toLowerCase());
    const isCustom = l.number.startsWith('custom-');

    if (!matchesSearch) return false;
    if (activeTab === 'custom') return isCustom;
    if (activeTab === 'course') return !isCustom;
    return true;
  });

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    c.instructor.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl animate-fade-in">
      {/* Header with Title and Import Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
            Course & Playlist Library
          </h1>
          <p className="text-sm text-[var(--color-secondary)] mt-1">
            Browse complete courses and playlists with full sequential lessons, AI search & study guides.
          </p>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="btn-accent inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Import Course / Playlist</span>
        </button>
      </div>

      {/* Filter and Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search playlists, courses, or specific topics..."
            className="input-field pl-10"
            aria-label="Filter library"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] self-start overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'playlists'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <Layers size={13} />
            Full Courses ({courses.length + 1})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            All Lessons ({lectures.length})
          </button>
          <button
            onClick={() => setActiveTab('course')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'course'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            Sigma Web Dev (18)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            <Sparkles size={12} />
            My Imports ({customCount})
          </button>
        </div>
      </div>

      {/* Courses & Playlists Tab Content */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Primary Sigma Web Dev Course */}
            {(() => {
              const sigmaNums = Array.from({ length: 18 }, (_, i) => String(i + 1));
              const sigmaProg = courseStorage.getCourseProgress(sigmaNums);
              const nextSigmaNum = sigmaNums.find((n) => !courseStorage.isLessonCompleted(n)) || '1';

              return (
                <div className="card overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between bg-[var(--color-surface)]">
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                      <img
                        src="https://img.youtube.com/vi/tVzUXW6siu0/hqdefault.jpg"
                        alt="Sigma Web Development Course"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
                        <Layers size={12} /> Featured Master Course
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-xs font-medium text-emerald-300 block mb-0.5">CodeWithHarry · Complete Series</span>
                        <h3 className="text-base font-bold leading-snug">Sigma Web Development Course</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                        18 sequential, comprehensive lectures taking you from HTML basics, semantic architecture, forms, CSS box model, selectors, flexbox, and grid into production-ready front-end engineering.
                      </p>

                      {/* Course Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-[var(--color-secondary)]">
                          <span className="font-medium">Course Progress</span>
                          <span className="font-mono text-[var(--color-accent)] font-semibold">
                            {sigmaProg.completed} / 18 completed ({sigmaProg.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                            style={{ width: `${sigmaProg.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[var(--color-secondary)]">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] font-medium">
                          18 Video Lessons
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] font-medium text-emerald-400">
                          Cross-Lesson AI RAG
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[var(--color-border)] mt-2 flex items-center justify-between">
                    <Link
                      to={`/lectures/${nextSigmaNum}`}
                      className="btn-accent text-xs font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 no-underline"
                    >
                      <Play size={14} className="fill-white" />
                      {sigmaProg.completed > 0 ? `Resume (Lesson ${nextSigmaNum})` : 'Start Course'}
                    </Link>
                    <button
                      onClick={() => setActiveTab('course')}
                      className="text-xs font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    >
                      View 18 Lessons →
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Custom Imported Courses */}
            {filteredCourses.map((course) => {
              const prog = courseStorage.getCourseProgress(course.lectures.map((l) => l.number));
              const nextLecture = course.lectures.find((l) => !courseStorage.isLessonCompleted(l.number)) || course.lectures[0];
              const nextPath = nextLecture ? `/lectures/${nextLecture.number}` : '/lectures';

              return (
                <div
                  key={course.id}
                  className="card overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between bg-[var(--color-surface)]"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                          <Layers size={32} className="text-[var(--color-accent)]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
                        <ListVideo size={12} /> Imported Playlist
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-xs font-medium text-emerald-300 block mb-0.5">{course.instructor}</span>
                        <h3 className="text-base font-bold leading-snug truncate">{course.title}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                        {course.description}
                      </p>

                      {/* Course Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-[var(--color-secondary)]">
                          <span className="font-medium">Course Progress</span>
                          <span className="font-mono text-[var(--color-accent)] font-semibold">
                            {prog.completed} / {course.totalLectures} completed ({prog.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
                            style={{ width: `${prog.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[var(--color-secondary)]">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] font-medium">
                          {course.totalLectures} Video Lessons
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] font-medium text-emerald-400">
                          Cross-Lesson AI RAG
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[var(--color-border)] mt-2 flex items-center justify-between">
                    <Link
                      to={nextPath}
                      className="btn-accent text-xs font-semibold py-2 px-4 rounded-xl inline-flex items-center gap-2 no-underline"
                    >
                      <Play size={14} className="fill-white" />
                      {prog.completed > 0 ? 'Resume Course' : 'Start Course'}
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete course"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Prompt to Import More Playlists */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-accent)]/10 via-[var(--color-accent)]/5 to-transparent border border-[var(--color-accent)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)] text-white flex items-center justify-center shrink-0 shadow-md">
                <ListVideo size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--color-primary)]">
                  Have another YouTube Course Playlist to study?
                </h4>
                <p className="text-xs text-[var(--color-secondary)] mt-0.5">
                  Paste any YouTube playlist link to automatically ingest all lessons, generate master study guides, and enable course-wide AI search.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn-accent text-xs font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap cursor-pointer shadow-sm hover:shadow-md"
            >
              + Import Course Playlist
            </button>
          </div>
        </div>
      )}

      {/* Individual Lessons View (All, Course, or My Imports) */}
      {activeTab !== 'playlists' && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLectures.map((lecture) => (
              <LectureCard key={lecture.number} lecture={lecture} />
            ))}
          </div>

          {filteredLectures.length === 0 && (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8">
              <BookOpen size={36} className="mx-auto text-[var(--color-secondary)] opacity-50 mb-3" />
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                {activeTab === 'custom' ? 'No custom course videos imported yet' : 'No lessons match your filter'}
              </p>
              <p className="text-xs text-[var(--color-secondary)] mt-1 max-w-sm mx-auto">
                Paste any YouTube playlist or course link to generate full AI notes and interactive player.
              </p>
              {activeTab === 'custom' && (
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="btn-accent mt-4 text-xs font-semibold px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} /> Import a Course Playlist
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Import Modal */}
      <ImportVideoModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
