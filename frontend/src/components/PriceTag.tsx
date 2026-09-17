interface PriceTagProps {
  price: number;
  changePercent: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function formatCurrency(value: number, currency = 'USD') {
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PriceTag({ price, changePercent, currency = 'USD', size = 'md' }: PriceTagProps) {
  const isUp = changePercent >= 0;
  return (
    <div className="flex flex-col items-end tabular-nums">
      <span className={`font-semibold ${sizeClasses[size]}`}>{formatCurrency(price, currency)}</span>
      <span className={`text-xs font-medium ${isUp ? 'text-brand' : 'text-loss'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
      </span>
    </div>
  );
}
