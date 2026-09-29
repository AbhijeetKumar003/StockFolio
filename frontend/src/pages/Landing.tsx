import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { PublicHeader } from '../components/PublicHeader';
import { useAuth } from '../context/AuthContext';

const tickers = [
  { symbol: 'TCS.NS', price: '4,128.60', change: '+1.24%', up: true },
  { symbol: 'AAPL', price: '228.02', change: '+0.68%', up: true },
  { symbol: 'RELIANCE.NS', price: '2,945.15', change: '-0.42%', up: false },
  { symbol: 'MSFT', price: '441.58', change: '+0.91%', up: true },
];

const features = [
  {
    title: 'Live prices, no refresh',
    body: 'Quotes stream over WebSockets every few seconds, so your dashboard moves with the market.',
    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  },
  {
    title: 'Real portfolio P&L',
    body: 'Invested value, current value and gains are calculated from live quotes, not stale snapshots.',
    icon: (
      <>
        <path d="M21 12a9 9 0 11-9-9" />
        <path d="M12 3a9 9 0 019 9h-9V3z" />
      </>
    ),
  },
  {
    title: 'NSE, BSE and US in one place',
    body: 'Search any ticker, add it to your watchlist and open intraday charts in a click.',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
  },
];

function HeroChart() {
  const line = 'M0 170 C40 160 60 130 100 138 S170 100 210 110 S280 60 320 78 S400 34 470 22';
  return (
    <svg viewBox="0 0 480 200" className="mt-4 w-full" role="img" aria-label="Portfolio value rising over time">
      <defs>
        <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--c-brand))" stopOpacity="0.3" />
          <stop offset="1" stopColor="rgb(var(--c-brand))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" x2="480" y1={y} y2={y} stroke="rgb(var(--c-line))" strokeDasharray="4 6" />
      ))}
      <path d={`${line} L470 200 L0 200 Z`} fill="url(#hero-fill)" />
      <path
        d={line}
        pathLength={1}
        fill="none"
        stroke="rgb(var(--c-brand))"
        strokeWidth="3"
        strokeLinecap="round"
        className="draw-line animate-draw"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      <circle cx="470" cy="22" r="10" fill="rgb(var(--c-brand))" opacity="0.2" />
      <circle cx="470" cy="22" r="5" fill="rgb(var(--c-brand))" />
    </svg>
  );
}

export function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgb(var(--c-line)) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)',
          }}
        />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-14 md:grid-cols-2 md:px-12 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" /> Live NSE · BSE · US data
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Your portfolio, priced live — down to the second.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted">
              StockFolio pulls real market data for NSE, BSE and US tickers, streams live prices to your
              dashboard, and tracks your gains and losses as they happen — no spreadsheets, no refresh button.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="rounded-card bg-brand px-6 py-3 text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:brightness-110"
              >
                {isAuthenticated ? 'Open dashboard' : 'Create free account'}
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="text-sm font-medium text-ink hover:text-brand">
                  I already have an account →
                </Link>
              )}
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

          <div className="relative animate-fade-up" style={{ animationDelay: '.15s' }}>
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand/25 via-transparent to-brand/10 blur-2xl" />
            <div className="relative rounded-card border border-line bg-surface p-5 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted">Portfolio value</p>
                  <p className="mt-1 font-display text-3xl font-semibold tabular-nums">₹4,86,320</p>
                </div>
                <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
                  ▲ +₹18,420 (3.94%)
                </span>
              </div>
              <HeroChart />
              <div className="mt-3 flex gap-2 text-xs font-medium">
                {['1D', '1W', '1M', '1Y'].map((r, i) => (
                  <span
                    key={r}
                    className={`rounded-full px-3 py-1 ${i === 0 ? 'bg-ink text-paper' : 'text-muted'}`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -right-3 -top-5 animate-float rounded-card border border-line bg-surface px-3 py-2 shadow-lg md:-right-6">
              <p className="text-xs font-medium text-ink">TCS.NS</p>
              <p className="text-xs font-semibold text-brand">▲ 1.24%</p>
            </div>
            <div className="absolute -bottom-5 -left-3 animate-float-slow rounded-card border border-line bg-surface px-3 py-2 shadow-lg md:-left-6">
              <p className="text-xs font-medium text-ink">AAPL</p>
              <p className="text-xs font-semibold text-brand">▲ 0.68%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {tickers.map((t) => (
            <li key={t.symbol} className="flex items-center justify-between border-line px-6 py-4 md:border-r md:last:border-r-0">
              <span className="text-sm font-medium text-ink">{t.symbol}</span>
              <span className="flex flex-col items-end tabular-nums">
                <span className="text-sm font-semibold">{t.price}</span>
                <span className={`text-xs font-medium ${t.up ? 'text-brand' : 'text-loss'}`}>
                  {t.up ? '▲' : '▼'} {t.change}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20">
        <h2 className="max-w-lg font-display text-2xl font-semibold text-ink md:text-3xl">
          Everything you need to track your investments
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-card border border-line bg-surface p-6 transition-shadow hover:shadow-lg hover:shadow-brand/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-card bg-brand-light text-brand">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="mx-auto max-w-6xl px-6 pb-16 md:px-12 md:pb-24">
          <div className="rounded-card bg-[linear-gradient(135deg,#12A37A,#0B5F45)] px-8 py-12 text-center text-white">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">Start tracking in under a minute</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
              Free to use. No API keys, no spreadsheets.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-block rounded-card bg-white px-6 py-3 text-sm font-medium text-[#0B5F45] transition hover:opacity-90"
            >
              Create free account
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
