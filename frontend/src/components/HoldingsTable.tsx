import { formatCurrency } from './PriceTag';

export interface Holding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  ltp: number;
  dayChangePercent: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dataStale: boolean;
}

export function HoldingsTable({
  holdings,
  onDelete,
}: {
  holdings: Holding[];
  onDelete?: (id: number) => void;
}) {
  if (holdings.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-surface p-10 text-center">
        <p className="text-sm text-muted">You don't have any holdings yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium text-right">Qty</th>
            <th className="px-4 py-3 font-medium text-right">Avg. buy</th>
            <th className="px-4 py-3 font-medium text-right">LTP</th>
            <th className="px-4 py-3 font-medium text-right">Current value</th>
            <th className="px-4 py-3 font-medium text-right">P&amp;L</th>
            {onDelete && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const isUp = h.pnl >= 0;
            return (
              <tr key={h.id} className="border-b border-line last:border-none hover:bg-paper">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{h.symbol}</div>
                  <div className="text-xs text-muted">{h.name}</div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{h.quantity}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(h.avgBuyPrice)}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrency(h.ltp)}
                  {h.dataStale && <span className="ml-1 text-xs text-muted">(cached)</span>}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(h.currentValue)}</td>
                <td className={`px-4 py-3 text-right tabular-nums font-medium ${isUp ? 'text-brand' : 'text-loss'}`}>
                  {isUp ? '+' : ''}
                  {formatCurrency(h.pnl)}
                  <div className="text-xs">
                    {isUp ? '+' : ''}
                    {h.pnlPercent.toFixed(2)}%
                  </div>
                </td>
                {onDelete && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(h.id)}
                      className="text-xs font-medium text-muted hover:text-loss"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
