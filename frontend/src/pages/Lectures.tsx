import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Lecture } from '../types';
import { FALLBACK_LECTURES } from '../data/fallbackLectures';
import LectureCard from '../components/LectureCard';
import ImportVideoModal from '../components/ImportVideoModal';
import { Search, Plus, Sparkles, Video, BookOpen } from 'lucide-react';

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>(FALLBACK_LECTURES);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'course'>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const loadLectures = () => {
    api.getLectures()
      .then((res) => {
        if (res.lectures && res.lectures.length > 0) {
          setLectures(res.lectures);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadLectures();
  }, []);

  const customCount = lectures.filter((l) => l.number.startsWith('custom-')).length;

  const filtered = lectures.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(filter.toLowerCase());
    const isCustom = l.number.startsWith('custom-');

    if (!matchesSearch) return false;
    if (activeTab === 'custom') return isCustom;
    if (activeTab === 'course') return !isCustom;
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl animate-fade-in">
      {/* Header with Title and Import Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">
            Lecture Library
          </h1>
          <p className="text-sm text-[var(--color-secondary)] mt-1">
            {lectures.length} lectures indexed with AI search, transcripts & study guides.
          </p>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="btn-accent inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Import Video / Link</span>
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
            placeholder="Search lectures, topics, or custom videos..."
            className="input-field pl-10"
            aria-label="Filter lectures"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            All ({lectures.length})
          </button>
          <button
            onClick={() => setActiveTab('course')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'course'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            Course ({lectures.length - customCount})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
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

      {/* Custom Lectures Hero Banner if none imported yet */}
      {customCount === 0 && activeTab === 'all' && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--color-accent)]/10 via-[var(--color-accent)]/5 to-transparent border border-[var(--color-accent)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center shrink-0">
              <Video size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)]">
                Have your own YouTube tutorial or recorded video?
              </p>
              <p className="text-[11px] text-[var(--color-secondary)]">
                Import any video URL or file to generate timestamped transcripts, AI chat, and a 6-8 page Master Study Guide.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="text-xs font-semibold text-[var(--color-accent)] hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            + Try Importing Video →
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((lecture) => (
          <LectureCard key={lecture.number} lecture={lecture} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8">
          <BookOpen size={36} className="mx-auto text-[var(--color-secondary)] opacity-50 mb-3" />
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            {activeTab === 'custom' ? 'No custom videos imported yet' : 'No lectures match your filter'}
          </p>
          <p className="text-xs text-[var(--color-secondary)] mt-1 max-w-sm mx-auto">
            {activeTab === 'custom'
              ? 'Paste any YouTube link or upload your own video file to generate full AI notes and interactive player.'
              : 'Try searching with a different keyword or view all lectures.'}
          </p>
          {activeTab === 'custom' && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn-accent mt-4 text-xs font-semibold px-4 py-2 inline-flex items-center gap-1.5"
            >
              <Plus size={15} /> Import Your First Video
            </button>
          )}
        </div>
      )}

      {/* Import Modal */}
      <ImportVideoModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          loadLectures();
        }}
      />
    </div>
  );
}
