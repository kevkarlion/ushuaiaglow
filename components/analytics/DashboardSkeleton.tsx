/**
 * DashboardSkeleton Component
 * Admin Analytics Dashboard - Phase 4
 * Full page loading skeleton combining all dashboard sections
 */

import KPICardsSkeleton from './KPICardsSkeleton';
import ChartSkeleton from './ChartSkeleton';

/**
 * Table row skeleton for RecentSales section
 */
function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5">
        <div className="h-4 w-16 bg-white/10 rounded" />
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="h-4 w-14 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded" />
      </div>
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 p-4 border-b border-white/5"
        >
          <div className="h-4 w-12 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-4 w-16 bg-white/10 rounded" />
          <div className="h-6 w-16 bg-white/10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Time filter skeleton */}
      <div className="flex gap-2">
        <div className="h-10 w-[200px] bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* KPI Cards skeleton */}
      <KPICardsSkeleton />

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart skeleton */}
        <div className="animate-pulse">
          <ChartSkeleton />
        </div>

        {/* Top products chart skeleton */}
        <div className="animate-pulse">
          <ChartSkeleton />
        </div>
      </div>

      {/* Bottom row: Status pie chart + Recent sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status pie chart skeleton */}
        <div className="animate-pulse">
          <ChartSkeleton />
        </div>

        {/* Recent sales table skeleton */}
        <div className="lg:col-span-2 bg-surface-darker/50 rounded-2xl border border-white/5 overflow-hidden animate-pulse">
          <div className="p-4 border-b border-white/5">
            <div className="h-5 w-32 bg-white/10 rounded" />
          </div>
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}