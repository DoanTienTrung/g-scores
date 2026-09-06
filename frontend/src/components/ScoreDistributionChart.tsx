import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Statistics } from '../api/types';

/** Best band to worst, so the colour ramp itself carries meaning. */
const LEVEL_COLOURS: Record<string, string> = {
  '1': '#10b981',
  '2': '#3b82f6',
  '3': '#f59e0b',
  '4': '#ef4444',
};

const formatCount = (value: number) => value.toLocaleString('vi-VN');

export function ScoreDistributionChart({ statistics }: { statistics: Statistics }) {
  // Recharts wants one row per category with a key per series.
  const data = statistics.subjects.map((subject) => ({
    subject: subject.displayName,
    ...subject.counts,
  }));

  return (
    <div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: '#475569' }}
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#475569' }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${value / 1000}k` : String(value)
              }
            />
            <Tooltip
              formatter={(value) => formatCount(Number(value))}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 13,
              }}
            />
            {statistics.levels.map((level) => (
              <Bar
                key={level.level}
                dataKey={String(level.level)}
                name={level.label}
                fill={LEVEL_COLOURS[String(level.level)]}
                radius={[3, 3, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/*
        Written by hand rather than using <Legend>: Recharts 3 renders its own
        legend in the reverse order of the bars, and no longer accepts a payload
        prop to correct it.
      */}
      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
        {statistics.levels.map((level) => (
          <li key={level.level} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: LEVEL_COLOURS[String(level.level)] }}
            />
            {level.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
