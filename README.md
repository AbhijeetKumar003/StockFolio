# StockPro

A full-stack, real-time stock portfolio tracker — rebuilt from an academic
Flask/MySQL mini-project into a modern, production-shaped app: React +
TypeScript frontend, Node/Express + TypeScript API, live price streaming over
WebSockets, and real market data (NSE, BSE and US tickers) with no paid API
key required.

## What changed from the original project

The original was a Flask app with plaintext password storage, prices fetched
only on manual page actions, no portfolio analytics, and a fixed-navbar
Bootstrap UI. This rebuild:

- Hashes passwords with **bcrypt** (12 rounds) and issues **JWT** sessions —
  nothing is ever stored in plaintext.
- Streams live prices over **Socket.IO**: every open dashboard, watchlist and
  stock page updates on its own, without a manual refresh.
- Computes real portfolio analytics server-side — invested value, current
  value, P&L amount and P&L % — using live quotes, not stored snapshots.
- Uses **yahoo-finance2** for free real-time quotes, intraday charts and
  ticker search (Indian tickers need a `.NS`/`.BO` suffix, e.g. `TCS.NS`,
  `RELIANCE.BO`; US tickers work as-is, e.g. `AAPL`).
- Ships a distinct, Groww-style UI: a dedicated design system (see
  `frontend/tailwind.config.js`), not default Bootstrap styling.

## Project structure

```
stockpro/
  backend/     Express + TypeScript API, SQLite storage, Socket.IO price stream
  frontend/    React + TypeScript + Tailwind app (Vite)
```

## Prerequisites

- Node.js 18 or newer (20+ recommended)
- npm

No MySQL/Postgres server to install — the backend uses SQLite (via
`better-sqlite3`), stored as a single file, so `npm install && npm run dev`
is all it takes to get a database.

## 1. Run the backend

```bash
cd backend
cp .env.example .env
# open .env and set JWT_SECRET to any long random string
npm install
npm run dev
```

The API starts on `http://localhost:4000`. It creates `backend/data/stockpro.db`
automatically on first run.

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env   # default already points at http://localhost:4000
npm install
npm run dev
```

Open `http://localhost:5173`, create an account, and search a stock (try
`TCS.NS`, `RELIANCE.NS`, `AAPL`, or `MSFT`).

## How the live pricing works

The frontend opens one Socket.IO connection and tells the server which
symbols the current screen cares about (`subscribe` / `unsubscribe`). The
server keeps a single shared poll of Yahoo Finance for the union of every
symbol any connected client has asked for, and pushes updates only to the
sockets that subscribed to that symbol — so ten browser tabs watching the
same stock cost one upstream request, not ten.

Quotes are also cached server-side for 5 seconds, so the search box, the
portfolio page and the socket stream never trigger duplicate upstream calls
for the same symbol within that window.

## Known limitations (worth knowing before you rely on this)

- **Yahoo Finance is unofficial and free** — there's no SLA, and it can
  rate-limit or change response shape without notice. It authenticates
  requests via a "crumb" cookie handshake that Yahoo has broken and fixed
  several times over the years; if every stock quote suddenly stops loading
  (dashboard/explore/watchlist all show a data error, or the Explore page
  goes blank), check the **backend terminal** first — failures are logged
  there with the underlying error — then run `npm outdated yahoo-finance2`
  in `backend/` and update to the latest version; the maintainers usually
  ship a fix within a few days of Yahoo changing something. For production
  use at scale, swap `backend/src/services/marketData.ts` for a licensed
  data vendor (e.g. Alpha Vantage, Twelve Data, or a broker's official feed)
  — the routes and socket layer don't need to change, only this one file.
- **SQLite is file-based** — great for one deployment/single-server use;
  move to Postgres/MySQL (swap `backend/src/db.ts`) if you need multiple
  app servers sharing one database.
- No brokerage integration — "adding a holding" records what you tell it
  (quantity + your buy price); it does not place real trades.
- The intraday chart uses 5-minute candles from the last 24 hours; it is not
  a full historical charting tool.

## Next steps if you want to keep building this

- Add password reset (email flow) and email verification.
- Add a "transactions" table instead of blended average buy price, so you
  can see individual buy/sell history per stock.
- Add sector/index overview cards (Nifty 50, Sensex, S&P 500) on the
  dashboard using `yahooFinance.quote()` on the index symbols (`^NSEI`,
  `^BSESN`, `^GSPC`).
- Deploy: backend to Render/Railway/Fly.io (set `JWT_SECRET`, `CORS_ORIGIN`,
  and mount a persistent volume for `data/`), frontend to Vercel/Netlify
  (set `VITE_API_URL` to the deployed backend URL).
