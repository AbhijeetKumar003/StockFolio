import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PriceChartProps {
  points: { time: string; close: number }[];
  isUp: boolean;
}

export function PriceChart({ points, isUp }: PriceChartProps) {
  const color = isUp ? '#0E7C5A' : '#D6453D';

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
        <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#E6E4DD" vertical={false} />
          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#E6E4DD' }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value: number) => [value.toFixed(2), 'Price']}
            labelFormatter={(t) => new Date(t).toLocaleString()}
            contentStyle={{ borderRadius: 8, border: '1px solid #E6E4DD', fontSize: 12 }}
          />
          <Line type="monotone" dataKey="close" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
