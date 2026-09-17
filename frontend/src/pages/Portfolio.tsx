import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { HoldingsTable, Holding } from '../components/HoldingsTable';
import { StockSearch } from '../components/StockSearch';
import { StatCard } from '../components/StatCard';
import { formatCurrency } from '../components/PriceTag';
import { api, apiErrorMessage } from '../lib/api';

interface Summary {
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<Summary>({ investedValue: 0, currentValue: 0, pnl: 0, pnlPercent: 0 });
  const [loading, setLoading] = useState(true);

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const { data } = await api.get('/portfolio');
    setHoldings(data.holdings);
    setSummary(data.summary);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!symbol) return setFormError('Search and pick a stock first.');
    setSubmitting(true);
    try {
      await api.post('/portfolio', {
        symbol,
        quantity: Number(quantity),
        avgBuyPrice: Number(avgBuyPrice),
      });
      setSymbol('');
      setQuantity('');
      setAvgBuyPrice('');
      await load();
    } catch (err) {
      setFormError(apiErrorMessage(err, 'Could not add that holding.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    await api.delete(`/portfolio/${id}`);
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  }

  const isUp = summary.pnl >= 0;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Portfolio</h1>
        <p className="mt-1 text-sm text-muted">All your holdings, priced live.</p>
      </div>

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

      <div className="mt-8 rounded-card border border-line bg-surface p-5">
        <h2 className="font-display text-base font-semibold text-ink">Add a holding</h2>
        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <StockSearch placeholder="Search stock…" onSelect={setSymbol} />
          {symbol && (
            <input
              disabled
              value={symbol}
              className="hidden rounded-card border border-line bg-paper px-3 py-2 text-sm sm:block"
            />
          )}
          <input
            type="number"
            min="0"
            step="any"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="rounded-card border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <input
            type="number"
            min="0"
            step="any"
            required
            value={avgBuyPrice}
            onChange={(e) => setAvgBuyPrice(e.target.value)}
            placeholder="Avg. buy price"
            className="rounded-card border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-card bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Adding…' : 'Add'}
          </button>
        </form>
        {symbol && <p className="mt-2 text-xs text-muted">Selected: {symbol}</p>}
        {formError && <p className="mt-2 text-sm text-loss">{formError}</p>}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted">Loading holdings…</p>
        ) : (
          <HoldingsTable holdings={holdings} onDelete={handleDelete} />
        )}
      </div>
    </AppShell>
  );
}
