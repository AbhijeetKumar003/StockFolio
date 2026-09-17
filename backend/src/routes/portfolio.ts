import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { getQuotes } from '../services/marketData';

const router = Router();
router.use(requireAuth);

const addSchema = z.object({
  symbol: z.string().trim().min(1).transform((s) => s.toUpperCase()),
  quantity: z.number().positive('Quantity must be greater than 0.'),
  avgBuyPrice: z.number().positive('Buy price must be greater than 0.'),
});

const updateSchema = z.object({
  quantity: z.number().positive('Quantity must be greater than 0.').optional(),
  avgBuyPrice: z.number().positive('Buy price must be greater than 0.').optional(),
});

router.get('/', async (req: AuthedRequest, res) => {
  const rows = db
    .prepare('SELECT id, symbol, quantity, avg_buy_price as avgBuyPrice FROM holdings WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user!.id) as { id: number; symbol: string; quantity: number; avgBuyPrice: number }[];

  if (rows.length === 0) return res.json({ holdings: [], summary: emptySummary() });

  const quotes = await getQuotes(rows.map((r) => r.symbol));
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));

  const holdings = rows.map((r) => {
    const quote = quoteMap.get(r.symbol);
    const ltp = quote?.regularMarketPrice ?? r.avgBuyPrice;
    const investedValue = r.quantity * r.avgBuyPrice;
    const currentValue = r.quantity * ltp;
    const pnl = currentValue - investedValue;
    const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;
    return {
      id: r.id,
      symbol: r.symbol,
      name: quote?.shortName ?? r.symbol,
      quantity: r.quantity,
      avgBuyPrice: r.avgBuyPrice,
      ltp,
      dayChangePercent: quote?.regularMarketChangePercent ?? 0,
      investedValue,
      currentValue,
      pnl,
      pnlPercent,
      dataStale: !quote,
    };
  });

  const summary = holdings.reduce(
    (acc, h) => {
      acc.investedValue += h.investedValue;
      acc.currentValue += h.currentValue;
      return acc;
    },
    emptySummary()
  );
  summary.pnl = summary.currentValue - summary.investedValue;
  summary.pnlPercent = summary.investedValue > 0 ? (summary.pnl / summary.investedValue) * 100 : 0;

  res.json({ holdings, summary });
});

router.post('/', (req: AuthedRequest, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { symbol, quantity, avgBuyPrice } = parsed.data;

  const existing = db
    .prepare('SELECT id, quantity, avg_buy_price FROM holdings WHERE user_id = ? AND symbol = ?')
    .get(req.user!.id, symbol) as { id: number; quantity: number; avg_buy_price: number } | undefined;

  if (existing) {
    // Merge into the existing position with a blended average buy price —
    // mirrors how a real brokerage combines repeat purchases of one stock.
    const totalQty = existing.quantity + quantity;
    const blendedAvg = (existing.quantity * existing.avg_buy_price + quantity * avgBuyPrice) / totalQty;
    db.prepare('UPDATE holdings SET quantity = ?, avg_buy_price = ? WHERE id = ?').run(totalQty, blendedAvg, existing.id);
    return res.json({ id: existing.id, merged: true });
  }

  const info = db
    .prepare('INSERT INTO holdings (user_id, symbol, quantity, avg_buy_price) VALUES (?, ?, ?, ?)')
    .run(req.user!.id, symbol, quantity, avgBuyPrice);
  res.status(201).json({ id: Number(info.lastInsertRowid), merged: false });
});

router.patch('/:id', (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const row = db
    .prepare('SELECT id FROM holdings WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.id);
  if (!row) return res.status(404).json({ error: 'Holding not found.' });

  const { quantity, avgBuyPrice } = parsed.data;
  if (quantity !== undefined) db.prepare('UPDATE holdings SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  if (avgBuyPrice !== undefined) db.prepare('UPDATE holdings SET avg_buy_price = ? WHERE id = ?').run(avgBuyPrice, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', (req: AuthedRequest, res) => {
  const info = db.prepare('DELETE FROM holdings WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Holding not found.' });
  res.json({ ok: true });
});

function emptySummary() {
  return { investedValue: 0, currentValue: 0, pnl: 0, pnlPercent: 0 };
}

export default router;
