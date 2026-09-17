import { Router } from 'express';
import { getQuote, getQuotes, searchSymbols, getIntradayHistory } from '../services/marketData';
import { INDICES, TRENDING_INDIA, TRENDING_US } from '../services/curatedSymbols';

const router = Router();

router.get('/explore', async (_req, res) => {
  try {
    const [indexQuotes, indiaQuotes, usQuotes] = await Promise.all([
      getQuotes(INDICES.map((i) => i.symbol)),
      getQuotes(TRENDING_INDIA),
      getQuotes(TRENDING_US),
    ]);

    if (indexQuotes.length === 0 && indiaQuotes.length === 0 && usQuotes.length === 0) {
      return res.status(502).json({
        error:
          'Live market data is unavailable right now (every symbol lookup failed). Check the backend terminal for the underlying error — this is usually a temporary issue with the free Yahoo Finance data source.',
      });
    }

    const indexQuoteMap = new Map(indexQuotes.map((q) => [q.symbol, q]));
    const indices = INDICES.map((i) => ({ label: i.label, quote: indexQuoteMap.get(i.symbol) ?? null })).filter(
      (i) => i.quote
    );

    const allTrending = [...indiaQuotes, ...usQuotes];
    const gainers = [...allTrending].sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent).slice(0, 6);
    const losers = [...allTrending].sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent).slice(0, 6);

    res.json({
      indices,
      india: indiaQuotes,
      us: usQuotes,
      gainers,
      losers,
    });
  } catch (err: any) {
    res.status(502).json({ error: 'Market overview is temporarily unavailable.', detail: err.message });
  }
});

router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 1) return res.json({ results: [] });
  try {
    const results = await searchSymbols(q);
    res.json({ results });
  } catch (err: any) {
    res.status(502).json({ error: 'Search is temporarily unavailable.', detail: err.message });
  }
});

router.get('/quote/:symbol', async (req, res) => {
  try {
    const quote = await getQuote(req.params.symbol);
    res.json({ quote });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

router.get('/quotes', async (req, res) => {
  const symbols = String(req.query.symbols || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (symbols.length === 0) return res.json({ quotes: [] });
  const quotes = await getQuotes(symbols);
  res.json({ quotes });
});

router.get('/history/:symbol', async (req, res) => {
  try {
    const points = await getIntradayHistory(req.params.symbol);
    res.json({ points });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
