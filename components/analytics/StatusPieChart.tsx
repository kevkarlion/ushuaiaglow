/**
 * StatusPieChart Component
 * Admin Analytics Dashboard - Phase 3
 * Pie chart showing order status distribution
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatusBreakdown, SaleStatus } from '@/types/analytics';

interface StatusPieChartProps {
  /** Status breakdown data */
  data?: StatusBreakdown[];
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Status color mapping
 */
const STATUS_COLORS: Record<SaleStatus, string> = {
  paid: '#34d399',     // green-400
  pending: '#fbbf24',  // amber-400
  cancelled: '#f87171', // red-400
  refunded: '#9ca3af', // gray-400
  failed: '#ef4444',  // red-500
};

/**
 * Status label mapping
 */
const STATUS_LABELS: Record<SaleStatus, string> = {
  paid: 'Pagados',
  pending: 'Pendientes',
  cancelled: 'Cancelados',
  refunded: 'Reembolsados',
  failed: 'Fallidos',
};

/**
 * Format number with Argentine locale
 */
function formatNumber(value: number): string {
  return value.toLocaleString('es-AR');
}

/**
 * Custom tooltip to show status count and percentage
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      status: SaleStatus;
      count: number;
      percentage: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-surface-darker border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">
        {STATUS_LABELS[data.status] || data.status}
      </p>
      <p className="text-sm text-white/80">
        {formatNumber(data.count)} pedidos
      </p>
      <p className="text-xs text-white/50 mt-1">
        {data.percentage.toFixed(1)}% del total
      </p>
    </div>
  );
}

/**
 * Custom legend renderer
 */
interface LegendPayloadItem {
  value?: SaleStatus | string;
  payload?: {
    count?: number;
    percentage?: number;
  };
}

function renderLegend({ payload }: { payload?: readonly LegendPayloadItem[] }) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => {
        if (!entry.value) return null;
        const colorKey = entry.value as SaleStatus;
        return (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[colorKey] || '#9ca3af' }}
            />
            <span className="text-xs text-white/60">
              {STATUS_LABELS[colorKey] || entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function StatusPieChart({ data = [], isLoading = false }: StatusPieChartProps) {
  // Calculate percentages from counts
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const chartData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
  }));

  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-5">
      {/* Header */}
      <h3 className="text-base font-semibold text-white mb-4">Estado de pedidos</h3>

      {/* Chart */}
      <div className="h-[200px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="count"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.status] || '#9ca3af'}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}