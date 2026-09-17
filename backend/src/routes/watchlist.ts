import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { getQuotes } from '../services/marketData';

const router = Router();
router.use(requireAuth);

const addSchema = z.object({
  symbol: z.string().trim().min(1).transform((s) => s.toUpperCase()),
});

router.get('/', async (req: AuthedRequest, res) => {
  const rows = db
    .prepare('SELECT id, symbol FROM watchlist WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user!.id) as { id: number; symbol: string }[];

  if (rows.length === 0) return res.json({ items: [] });

  const quotes = await getQuotes(rows.map((r) => r.symbol));
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

  const items = rows.map((r) => ({
    id: r.id,
    symbol: r.symbol,
    quote: quoteMap.get(r.symbol) ?? null,
  }));
  res.json({ items });
});

router.post('/', (req: AuthedRequest, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  try {
    const info = db
      .prepare('INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)')
      .run(req.user!.id, parsed.data.symbol);
    res.status(201).json({ id: Number(info.lastInsertRowid) });
  } catch {
    res.status(409).json({ error: `${parsed.data.symbol} is already on your watchlist.` });
  }
});

router.delete('/:id', (req: AuthedRequest, res) => {
  const info = db.prepare('DELETE FROM watchlist WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Watchlist item not found.' });
  res.json({ ok: true });
});

export default router;
