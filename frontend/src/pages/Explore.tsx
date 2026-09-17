import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { formatCurrency } from '../components/PriceTag';
import { api, apiErrorMessage } from '../lib/api';
import { useLiveQuotes } from '../lib/useLiveQuotes';

interface Quote {
  symbol: string;
  shortName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
}

interface ExploreData {
  indices: { label: string; quote: Quote }[];
  india: Quote[];
  us: Quote[];
  gainers: Quote[];
  losers: Quote[];
}

function StockRow({ quote, live }: { quote: Quote; live?: Quote }) {
  const price = live?.regularMarketPrice ?? quote.regularMarketPrice;
  const changePercent = live?.regularMarketChangePercent ?? quote.regularMarketChangePercent;
  const isUp = changePercent >= 0;
  return (
    <Link
      to={`/stock/${quote.symbol}`}
      className="flex items-center justify-between border-b border-line px-4 py-3 last:border-none hover:bg-paper"
    >
      <span>
        <span className="font-medium text-ink">{quote.symbol}</span>
        <span className="ml-2 text-xs text-muted">{quote.shortName}</span>
      </span>
      <span className="flex items-center gap-3 tabular-nums">
        <span>{formatCurrency(price, quote.currency)}</span>
        <span className={`w-16 text-right text-xs font-medium ${isUp ? 'text-brand' : 'text-loss'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </span>
    </Link>
  );
}

function StockList({ title, quotes, live }: { title: string; quotes: Quote[]; live: Record<string, Quote> }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="overflow-hidden rounded-card border border-line bg-surface">
        {quotes.map((q) => (
          <StockRow key={q.symbol} quote={q} live={live[q.symbol]} />
        ))}
      </div>
    </div>
  );
}

export function Explore() {
  const [data, setData] = useState<ExploreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/market/explore')
      .then((res) => setData(res.data))
      .catch((err) => setError(apiErrorMessage(err, 'Could not load market data right now. Try again shortly.')))
      .finally(() => setLoading(false));
  }, []);

  const allSymbols = data
    ? [...data.india, ...data.us, ...data.indices.map((i) => i.quote)].map((q) => q.symbol)
    : [];
  const live = useLiveQuotes(allSymbols);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Explore</h1>
        <p className="mt-1 text-sm text-muted">Browse indices and trending stocks — click any row for the chart.</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading the market…</p>
      ) : error ? (
        <p className="rounded-card bg-loss-light px-4 py-3 text-sm text-loss">{error}</p>
      ) : data ? (
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">Indices</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {data.indices.map(({ label, quote }) => {
                const liveQuote = live[quote.symbol];
                const changePercent = liveQuote?.regularMarketChangePercent ?? quote.regularMarketChangePercent;
                const price = liveQuote?.regularMarketPrice ?? quote.regularMarketPrice;
                const isUp = changePercent >= 0;
                return (
                  <Link
                    key={quote.symbol}
                    to={`/stock/${quote.symbol}`}
                    className="rounded-card border border-line bg-surface p-4 hover:border-brand"
                  >
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-1 font-display font-semibold tabular-nums">
                      {price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-medium ${isUp ? 'text-brand' : 'text-loss'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <StockList title="Top gainers" quotes={data.gainers} live={live} />
            <StockList title="Top losers" quotes={data.losers} live={live} />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <StockList title="Trending — India" quotes={data.india} live={live} />
            <StockList title="Trending — US" quotes={data.us} live={live} />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
