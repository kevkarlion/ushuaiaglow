/**
 * TopProductsChart Component
 * Admin Analytics Dashboard - Phase 3
 * Horizontal bar chart showing top 10 products by revenue
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TopProduct } from '@/types/analytics';

interface TopProductsChartProps {
  /** Top products data (max 10) */
  data: TopProduct[];
}

/**
 * Truncate text to max length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format currency for display
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Custom tooltip to show full product name and revenue
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: TopProduct }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const product = payload[0]?.payload;
  if (!product) return null;

  return (
    <div className="bg-surface-darker border border-white/10 rounded-lg px-3 py-2 shadow-xl max-w-xs">
      <p className="text-xs text-white/60 mb-1">Producto</p>
      <p className="text-sm font-medium text-white mb-2">{product.title}</p>
      <p className="text-sm font-semibold text-white">
        {formatCurrency(product.revenue)}
      </p>
      <p className="text-xs text-white/50 mt-1">
        {product.quantity.toLocaleString('es-AR')} unidades
      </p>
    </div>
  );
}

// Color palette for bars
const BAR_COLORS = [
  '#53D1F9', // primary
  '#eb7690', // accent
  '#a78bfa', // violet-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#f472b6', // pink-400
  '#60a5fa', // blue-400
  '#4ade80', // green-400
  '#fb923c', // orange-400
  '#c084fc', // purple-400
];

export default function TopProductsChart({ data }: TopProductsChartProps) {
  // Prepare data for horizontal bar chart
  // Recharts horizontal bars use XAxis for the numeric axis
  const chartData = data.slice(0, 10).map((product, index) => ({
    ...product,
    displayName: truncateText(product.title, 30),
    color: BAR_COLORS[index % BAR_COLORS.length],
  }));

  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-5">
      {/* Header */}
      <h3 className="text-base font-semibold text-white mb-4">Productos más vendidos</h3>

      {/* Chart */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tickFormatter={(value) => formatCurrency(value)}
              stroke="rgba(255, 255, 255, 0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              width={100}
              stroke="rgba(255, 255, 255, 0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}