interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export function StatCard({ label, value, delta, deltaPositive }: StatCardProps) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {delta && (
        <p className={`mt-1 text-sm font-medium tabular-nums ${deltaPositive ? 'text-brand' : 'text-loss'}`}>
          {delta}
        </p>
      )}
    </div>
  );
}
