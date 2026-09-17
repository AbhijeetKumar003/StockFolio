import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { StockSearch } from '../components/StockSearch';
import { formatCurrency } from '../components/PriceTag';
import { api, apiErrorMessage } from '../lib/api';
import { useLiveQuotes } from '../lib/useLiveQuotes';

interface WatchItem {
  id: number;
  symbol: string;
  quote: {
    shortName: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    currency: string;
  } | null;
}

export function Watchlist() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const liveQuotes = useLiveQuotes(items.map((i) => i.symbol));

  async function load() {
    const { data } = await api.get('/watchlist');
    setItems(data.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(symbol: string) {
    setError('');
    try {
      await api.post('/watchlist', { symbol });
      await load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not add that stock.'));
    }
  }

  async function handleRemove(id: number) {
    await api.delete(`/watchlist/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Watchlist</h1>
          <p className="mt-1 text-sm text-muted">Track prices without owning the stock.</p>
        </div>
        <div className="w-72">
          <StockSearch placeholder="Add a stock to watch…" onSelect={handleAdd} />
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-loss">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">Loading watchlist…</p>
      ) : items.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-10 text-center">
          <p className="text-sm text-muted">Your watchlist is empty. Search above to add a stock.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {items.map((item) => {
            const live = liveQuotes[item.symbol];
            const price = live?.regularMarketPrice ?? item.quote?.regularMarketPrice;
            const changePercent = live?.regularMarketChangePercent ?? item.quote?.regularMarketChangePercent ?? 0;
            const isUp = changePercent >= 0;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-line px-4 py-3 last:border-none hover:bg-paper"
              >
                <Link to={`/stock/${item.symbol}`} className="flex-1">
                  <div className="font-medium text-ink">{item.symbol}</div>
                  <div className="text-xs text-muted">{item.quote?.shortName ?? 'Live data unavailable'}</div>
                </Link>
                {price !== undefined && (
                  <div className="flex items-center gap-4 tabular-nums">
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(price, item.quote?.currency)}</div>
                      <div className={`text-xs font-medium ${isUp ? 'text-brand' : 'text-loss'}`}>
                        {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs font-medium text-muted hover:text-loss"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
