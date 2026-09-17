import YahooFinance from 'yahoo-finance2';
import { CandlePoint, Quote } from '../types';

// Thin wrapper around yahoo-finance2 (free, no API key required).
//
// IMPORTANT — this hits Yahoo's *unofficial* finance API. Yahoo has no
// public API contract, and periodically changes the cookie/crumb handshake
// this library depends on to authenticate requests. When that happens every
// quote lookup fails until the library catches up (see the project's GitHub
// issues for the history). If quotes stop working:
//   1. Check this server's terminal output — failures are logged below with
//      the underlying error, not swallowed.
//   2. `npm outdated yahoo-finance2` and update to the latest version; the
//      maintainers usually ship a fix within days.
//   3. As a longer-term fix, swap this file for a licensed data vendor
//      (Alpha Vantage, Twelve Data, a broker's official feed) — nothing
//      outside this file needs to change.
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const QUOTE_TTL_MS = 5000;
const quoteCache = new Map<string, { data: Quote; expires: number }>();

function normalizeSymbol(raw: string): string {
  return raw.trim().toUpperCase();
}

export async function getQuote(rawSymbol: string): Promise<Quote> {
  const symbol = normalizeSymbol(rawSymbol);
  const cached = quoteCache.get(symbol);
  if (cached && cached.expires > Date.now()) return cached.data;

  let result: any;
  try {
    result = await yahooFinance.quote(symbol);
  } catch (err: any) {
    console.error(`[marketData] quote("${symbol}") failed:`, err.message ?? err);
    throw new Error(
      `Could not fetch live data for "${symbol}" right now. This is usually a temporary Yahoo Finance issue — see the server terminal for details.`
    );
  }

  if (!result || result.regularMarketPrice === undefined) {
    throw new Error(`No live data for "${symbol}". Check the ticker (Indian stocks need a .NS or .BO suffix, e.g. TCS.NS).`);
  }

  const quote: Quote = {
    symbol: result.symbol ?? symbol,
    shortName: result.shortName ?? result.longName ?? symbol,
    currency: result.currency ?? 'USD',
    regularMarketPrice: result.regularMarketPrice,
    regularMarketChange: result.regularMarketChange ?? 0,
    regularMarketChangePercent: result.regularMarketChangePercent ?? 0,
    regularMarketDayHigh: result.regularMarketDayHigh ?? result.regularMarketPrice,
    regularMarketDayLow: result.regularMarketDayLow ?? result.regularMarketPrice,
    regularMarketVolume: result.regularMarketVolume ?? 0,
    regularMarketPreviousClose: result.regularMarketPreviousClose ?? result.regularMarketPrice,
    marketState: result.marketState ?? 'UNKNOWN',
  };

  quoteCache.set(symbol, { data: quote, expires: Date.now() + QUOTE_TTL_MS });
  return quote;
}

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  const settled = await Promise.allSettled(symbols.map(getQuote));
  const failures = settled.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(
      `[marketData] ${failures.length}/${symbols.length} quote lookups failed. First error: ${failures[0].reason?.message}`
    );
  }
  return settled
    .filter((r): r is PromiseFulfilledResult<Quote> => r.status === 'fulfilled')
    .map((r) => r.value);
}

export async function searchSymbols(query: string) {
  const result = await yahooFinance.search(query, { quotesCount: 8, newsCount: 0 });
  return (result.quotes ?? [])
    .filter((q: any) => q.symbol && (q.isYahooFinance ?? true))
    .map((q: any) => ({
      symbol: q.symbol,
      name: q.shortname ?? q.longname ?? q.symbol,
      exchange: q.exchDisp ?? q.exchange ?? '',
      type: q.typeDisp ?? q.quoteType ?? '',
    }));
}

export async function getIntradayHistory(rawSymbol: string): Promise<CandlePoint[]> {
  const symbol = normalizeSymbol(rawSymbol);
  const chart = await yahooFinance.chart(symbol, {
    period1: new Date(Date.now() - 24 * 60 * 60 * 1000),
    interval: '5m',
  });

  return (chart.quotes ?? [])
    .filter((q: any) => q.close !== null && q.close !== undefined)
    .map((q: any) => ({
      time: new Date(q.date).toISOString(),
      close: Number(q.close.toFixed(2)),
    }));
}
