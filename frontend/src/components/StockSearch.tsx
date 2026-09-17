import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export function StockSearch({
  placeholder = 'Search a stock…',
  onSelect,
}: {
  placeholder?: string;
  onSelect: (symbol: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const { data } = await api.get('/market/search', { params: { q: query } });
        setResults(data.results);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  function pick(symbol: string) {
    onSelect(symbol);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-card border border-line bg-paper px-4 py-2 text-sm outline-none transition-colors focus:border-brand focus:bg-surface"
      />
      {open && (query.length > 0) && (
        <div className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto rounded-card border border-line bg-surface shadow-lg">
          {loading && <p className="px-4 py-3 text-sm text-muted">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">No matches for "{query}".</p>
          )}
          {!loading &&
            results.map((r) => (
              <button
                key={r.symbol}
                onClick={() => pick(r.symbol)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-paper"
              >
                <span>
                  <span className="font-medium text-ink">{r.symbol}</span>
                  <span className="ml-2 text-muted">{r.name}</span>
                </span>
                <span className="text-xs text-muted">{r.exchange}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
