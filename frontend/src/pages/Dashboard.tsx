import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { StatCard } from '../components/StatCard';
import { HoldingsTable, Holding } from '../components/HoldingsTable';
import { formatCurrency } from '../components/PriceTag';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Summary {
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

interface WatchItem {
  id: number;
  symbol: string;
  quote: { regularMarketPrice: number; regularMarketChangePercent: number } | null;
}

export function Dashboard() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<Summary>({ investedValue: 0, currentValue: 0, pnl: 0, pnlPercent: 0 });
  const [watch, setWatch] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [portfolioRes, watchlistRes] = await Promise.all([
      api.get('/portfolio'),
      api.get('/watchlist'),
    ]);
    setHoldings(portfolioRes.data.holdings);
    setSummary(portfolioRes.data.summary);
    setWatch(watchlistRes.data.items.slice(0, 5));
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000); // periodic resync on top of live socket ticks elsewhere
    return () => clearInterval(interval);
  }, []);

  const isUp = summary.pnl >= 0;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-muted">Here's how your portfolio is doing right now.</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading your portfolio…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Invested value" value={formatCurrency(summary.investedValue)} />
            <StatCard label="Current value" value={formatCurrency(summary.currentValue)} />
            <StatCard
              label="Total P&L"
              value={`${isUp ? '+' : ''}${formatCurrency(summary.pnl)}`}
              delta={`${isUp ? '+' : ''}${summary.pnlPercent.toFixed(2)}%`}
              deltaPositive={isUp}
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Holdings</h2>
            <Link to="/portfolio" className="text-sm font-medium text-brand">
              Manage portfolio →
            </Link>
          </div>
          <div className="mt-3">
            <HoldingsTable holdings={holdings.slice(0, 5)} />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Watchlist</h2>
            <Link to="/watchlist" className="text-sm font-medium text-brand">
              View all →
            </Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-card border border-line bg-surface">
            {watch.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted">
                Nothing on your watchlist yet. Search a stock to add one.
              </p>
            ) : (
              watch.map((w) => {
                const up = (w.quote?.regularMarketChangePercent ?? 0) >= 0;
                return (
                  <Link
                    key={w.id}
                    to={`/stock/${w.symbol}`}
                    className="flex items-center justify-between border-b border-line px-4 py-3 last:border-none hover:bg-paper"
                  >
                    <span className="font-medium text-ink">{w.symbol}</span>
                    {w.quote && (
                      <span className="flex items-center gap-3 tabular-nums">
                        <span>{formatCurrency(w.quote.regularMarketPrice)}</span>
                        <span className={`text-xs font-medium ${up ? 'text-brand' : 'text-loss'}`}>
                          {up ? '▲' : '▼'} {Math.abs(w.quote.regularMarketChangePercent).toFixed(2)}%
                        </span>
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
