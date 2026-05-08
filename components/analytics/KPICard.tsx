/**
 * KPICard Component
 * Admin Analytics Dashboard - Phase 2
 * Displays a single KPI metric with trend indicator
 */

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Label text displayed above the value */
  label: string;
  /** Numeric value to display */
  value: number;
  /** Subtext displayed below the value (e.g., comparison text) */
  subtext: string;
  /** Previous period value for trend calculation */
  previousValue?: number;
  /** Format type for the value */
  format?: 'currency' | 'number';
  /** Custom color for icon background */
  iconColor?: string;
}

/**
 * Calculate percentage change between current and previous value
 */
function calculateTrend(current: number, previous: number): { percentage: number; isPositive: boolean } | null {
  if (!previous || previous === 0) return null;
  
  const change = ((current - previous) / previous) * 100;
  return {
    percentage: Math.abs(change),
    isPositive: change >= 0,
  };
}

/**
 * Format a number as Argentine currency ($X.XXX,XX)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with Argentine locale
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value);
}

export default function KPICard({
  icon: Icon,
  label,
  value,
  subtext,
  previousValue,
  format = 'currency',
  iconColor = 'bg-primary/10 text-primary',
}: KPICardProps) {
  // Calculate trend if previous value is provided
  const trend = previousValue !== undefined ? calculateTrend(value, previousValue) : null;

  // Format value based on type
  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-5">
      {/* Header: Icon + Label */}
      <div className="flex items-start justify-between mb-4">
        {/* Label */}
        <span className="text-sm text-white/60">{label}</span>
        
        {/* Icon */}
        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Value */}
      <div className="space-y-1">
        <span className="text-2xl font-bold text-white">
          {formattedValue}
        </span>
        
        {/* Subtext with optional trend indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">{subtext}</span>
          
          {trend && (
            <div
              className={`flex items-center gap-0.5 text-xs font-medium ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.percentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
