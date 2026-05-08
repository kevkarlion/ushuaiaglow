/**
 * RevenueChart Component
 * Admin Analytics Dashboard - Phase 3
 * Line chart showing revenue over time
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '@/types/analytics';

interface RevenueChartProps {
  /** Revenue data points */
  data: ChartDataPoint[];
}

/**
 * Format date from YYYY-MM-DD to DD/MM (Argentine format)
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

/**
 * Format currency for Y-axis labels
 */
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

/**
 * Custom tooltip to show date and revenue
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const revenue = payload[0]?.value ?? 0;
  const formattedDate = label ? formatDate(label) : '';

  return (
    <div className="bg-surface-darker border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-white/60 mb-1">{formattedDate}</p>
      <p className="text-sm font-semibold text-white">
        {new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
        }).format(revenue)}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-5">
      {/* Header */}
      <h3 className="text-base font-semibold text-white mb-4">Ingresos por día</h3>

      {/* Chart */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="rgba(255, 255, 255, 0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="rgba(255, 255, 255, 0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#53D1F9"
              strokeWidth={2}
              dot={{ fill: '#53D1F9', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#53D1F9', strokeWidth: 2, stroke: '#fff' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}