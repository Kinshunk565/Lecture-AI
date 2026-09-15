import { useState, useCallback, useRef } from 'react';
import { Search as SearchIcon, Play, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { SearchResult } from '../types';
import { formatTime } from '../utils/formatTime';
import EmptyState from '../components/EmptyState';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (q?: string) => {
    const searchQuery = (q || query).trim();
    if (!searchQuery) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await api.search(searchQuery);
      setResults(response.results);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length >= 3) {
      debounceRef.current = setTimeout(() => handleSearch(val), 600);
    }
  }, [handleSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  // Group results by lecture number
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const key = `${r.number}-${r.title}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Search your lectures</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">
          Semantic search across all indexed lecture content.
        </p>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by concept, topic, or question..."
          className="input-field text-base pl-11 pr-24 py-4"
          autoFocus
          aria-label="Search lectures"
        />
        <button
          onClick={() => handleSearch()}
          disabled={!query.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
        </button>
      </div>

      {/* Quick suggestions */}
      {!searched && (
        <div className="space-y-2 mb-8">
          <span className="section-title">Try searching</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              'What is CSS?',
              'HTML forms and input tags',
              'Semantic tags',
              'CSS Box Model',
              'Id and classes',
            ].map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="flex items-center gap-2.5 py-8 justify-center">
          <Loader2 size={16} className="text-[var(--color-accent)] animate-spin" />
          <span className="text-sm text-[var(--color-secondary)]">Searching lectures...</span>
        </div>
      )}

      {error && (
        <div className="bg-[var(--color-error-light)] border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <EmptyState
          title="No results found"
          description="Try rephrasing your query or searching for a different topic covered in the lectures."
          icon={<SearchIcon size={24} className="text-[var(--color-secondary)]" />}
        />
      )}

      {!loading && Object.keys(grouped).length > 0 && (
        <div className="space-y-6">
          <p className="text-sm text-[var(--color-secondary)]">
            {results.length} relevant segments found
          </p>
          {Object.entries(grouped).map(([key, items]) => (
            <div key={key} className="card overflow-hidden">
              <div className="px-4 py-3 bg-[var(--color-background)] border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary)]">
                      Video {items[0].number} — {items[0].title}
                    </p>
                    <p className="text-xs text-[var(--color-secondary)]">{items.length} matching segments</p>
                  </div>
                  <Link
                    to={`/lectures/${items[0].number}`}
                    className="btn-secondary text-xs py-1.5"
                  >
                    Open <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-[var(--color-border)]/50">
                {items.map((result, i) => (
                  <Link
                    key={`${result.start}-${i}`}
                    to={`/lectures/${result.number}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--color-background)] transition-colors no-underline"
                  >
                    <div className="w-8 h-8 rounded-md bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Play size={12} className="text-[var(--color-accent)] ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-primary)] leading-relaxed">{result.text}</p>
                      <span className="text-xs font-mono text-[var(--color-accent)] mt-1 inline-block">
                        {formatTime(result.start)} — {formatTime(result.end)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
