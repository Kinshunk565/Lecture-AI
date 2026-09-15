import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Lecture } from '../types';
import LectureCard from '../components/LectureCard';
import LoadingState from '../components/LoadingState';
import { Search } from 'lucide-react';

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.getLectures()
      .then(res => setLectures(res.lectures))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? lectures.filter(l => l.title.toLowerCase().includes(filter.toLowerCase()))
    : lectures;

  if (loading) return <LoadingState message="Loading lectures..." />;

  return (
    <div className="p-6 md:p-8 max-w-5xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Lecture Library</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">
          {lectures.length} lectures indexed and ready to search.
        </p>
      </div>

      {/* Filter */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter lectures by title..."
          className="input-field pl-10"
          aria-label="Filter lectures"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(lecture => (
          <LectureCard key={lecture.number} lecture={lecture} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-[var(--color-secondary)]">No lectures match your filter.</p>
        </div>
      )}
    </div>
  );
}
