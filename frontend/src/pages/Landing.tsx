import { Link } from 'react-router-dom';

const tickers = [
  { symbol: 'TCS.NS', price: '4,128.60', change: '+1.24%', up: true },
  { symbol: 'AAPL', price: '228.02', change: '+0.68%', up: true },
  { symbol: 'RELIANCE.NS', price: '2,945.15', change: '-0.42%', up: false },
  { symbol: 'MSFT', price: '441.58', change: '+0.91%', up: true },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line px-6 py-4 md:px-12">
        <span className="font-display text-lg font-semibold tracking-tight">
          Stock<span className="text-brand">Pro</span>
        </span>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted hover:text-ink">
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-card bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:px-12 md:py-24">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Your portfolio, priced live — down to the second.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted">
            StockPro pulls real market data for NSE, BSE and US tickers, streams live prices to your
            dashboard, and tracks your gains and losses as they happen — no spreadsheets, no refresh button.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/register"
              className="rounded-card bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Create free account
            </Link>
            <Link to="/login" className="text-sm font-medium text-ink hover:text-brand">
              I already have an account →
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <dt className="text-xs text-muted">Update interval</dt>
              <dd className="mt-1 font-display text-lg font-semibold">~4 sec</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Markets covered</dt>
              <dd className="mt-1 font-display text-lg font-semibold">NSE · BSE · US</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Cost</dt>
              <dd className="mt-1 font-display text-lg font-semibold">Free</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-card border border-line bg-surface p-2 shadow-sm">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-medium text-ink">Live market</span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> streaming
            </span>
          </div>
          <ul>
            {tickers.map((t) => (
              <li
                key={t.symbol}
                className="flex items-center justify-between border-b border-line px-4 py-4 last:border-none"
              >
                <span className="font-medium text-ink">{t.symbol}</span>
                <span className="flex flex-col items-end tabular-nums">
                  <span className="font-semibold">{t.price}</span>
                  <span className={`text-xs font-medium ${t.up ? 'text-brand' : 'text-loss'}`}>
                    {t.up ? '▲' : '▼'} {t.change}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
