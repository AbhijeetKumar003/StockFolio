import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { PriceChart } from '../components/PriceChart';
import { formatCurrency } from '../components/PriceTag';
import { api, apiErrorMessage } from '../lib/api';
import { useLiveQuotes } from '../lib/useLiveQuotes';

interface Quote {
  symbol: string;
  shortName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  marketState: string;
}

export function StockDetail() {
  const { symbol = '' } = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [points, setPoints] = useState<{ time: string; close: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liveQuotes = useLiveQuotes(symbol ? [symbol] : []);
  const live = liveQuotes[symbol];

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get(`/market/quote/${symbol}`).then((r) => r.data.quote),
      api.get(`/market/history/${symbol}`).then((r) => r.data.points),
    ])
      .then(([q, p]) => {
        setQuote(q);
        setPoints(p);
      })
      .catch((err) => setError(apiErrorMessage(err, 'Could not load this stock.')))
      .finally(() => setLoading(false));
  }, [symbol]);

  async function addToWatchlist() {
    setActionMessage('');
    try {
      await api.post('/watchlist', { symbol });
      setActionMessage(`${symbol} added to your watchlist.`);
    } catch (err) {
      setActionMessage(apiErrorMessage(err));
    }
  }

  async function addToPortfolio(e: FormEvent) {
    e.preventDefault();
    setActionMessage('');
    setSubmitting(true);
    try {
      await api.post('/portfolio', {
        symbol,
        quantity: Number(quantity),
        avgBuyPrice: Number(avgBuyPrice),
      });
      setActionMessage(`${symbol} added to your portfolio.`);
      setQuantity('');
      setAvgBuyPrice('');
    } catch (err) {
      setActionMessage(apiErrorMessage(err, 'Could not add to portfolio.'));
    } finally {
      setSubmitting(false);
    }
  }

  const displayPrice = live?.regularMarketPrice ?? quote?.regularMarketPrice ?? 0;
  const displayChangePercent = live?.regularMarketChangePercent ?? quote?.regularMarketChangePercent ?? 0;
  const isUp = displayChangePercent >= 0;

  return (
    <AppShell>
      {loading ? (
        <p className="text-sm text-muted">Loading {symbol}…</p>
      ) : error ? (
        <p className="rounded-card bg-loss-light px-4 py-3 text-sm text-loss">{error}</p>
      ) : quote ? (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">{quote.symbol}</h1>
              <p className="mt-1 text-sm text-muted">{quote.shortName}</p>
            </div>
            <div className="text-right tabular-nums">
              <p className="font-display text-3xl font-semibold">{formatCurrency(displayPrice, quote.currency)}</p>
              <p className={`text-sm font-medium ${isUp ? 'text-brand' : 'text-loss'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(displayChangePercent).toFixed(2)}% today
              </p>
            </div>
          </div>

          <PriceChart points={points} isUp={isUp} />

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Day high" value={formatCurrency(quote.regularMarketDayHigh, quote.currency)} />
            <Metric label="Day low" value={formatCurrency(quote.regularMarketDayLow, quote.currency)} />
            <Metric label="Prev. close" value={formatCurrency(quote.regularMarketPreviousClose, quote.currency)} />
            <Metric label="Volume" value={quote.regularMarketVolume.toLocaleString()} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-card border border-line bg-surface p-5">
              <h2 className="font-display text-base font-semibold text-ink">Add to watchlist</h2>
              <p className="mt-1 text-sm text-muted">Track this price without buying.</p>
              <button
                onClick={addToWatchlist}
                className="mt-4 rounded-card border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
              >
                Add {symbol}
              </button>
            </div>

            <div className="rounded-card border border-line bg-surface p-5">
              <h2 className="font-display text-base font-semibold text-ink">Add to portfolio</h2>
              <form onSubmit={addToPortfolio} className="mt-4 flex flex-wrap gap-3">
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantity"
                  className="w-32 rounded-card border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={avgBuyPrice}
                  onChange={(e) => setAvgBuyPrice(e.target.value)}
                  placeholder="Buy price"
                  className="w-32 rounded-card border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-card bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Adding…' : 'Add'}
                </button>
              </form>
            </div>
          </div>
          {actionMessage && <p className="mt-4 text-sm text-brand">{actionMessage}</p>}
        </>
      ) : null}
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-medium tabular-nums text-ink">{value}</p>
    </div>
  );
}
