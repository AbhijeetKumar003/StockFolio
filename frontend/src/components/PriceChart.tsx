import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface PriceChartProps {
  points: { time: string; close: number }[];
  isUp: boolean;
}

const palette = {
  light: { up: '#0E7C5A', down: '#D6453D', grid: '#E6E4DD', tick: '#6B7280', tip: '#FFFFFF', text: '#12151C' },
  dark: { up: '#18B07E', down: '#F0625A', grid: '#232E3A', tick: '#8B97A6', tip: '#121921', text: '#E8ECF1' },
};

export function PriceChart({ points, isUp }: PriceChartProps) {
  const { theme } = useTheme();
  const c = palette[theme];
  const color = isUp ? c.up : c.down;

  if (points.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-card border border-line bg-surface text-sm text-muted">
        No intraday data available right now.
      </div>
    );
  }

  return (
    <div className="h-72 rounded-card border border-line bg-surface p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={c.grid} vertical={false} />
          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            tick={{ fontSize: 11, fill: c.tick }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: c.tick }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value: number) => [value.toFixed(2), 'Price']}
            labelFormatter={(t) => new Date(t).toLocaleString()}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${c.grid}`,
              background: c.tip,
              color: c.text,
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2} fill="url(#price-fill)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
