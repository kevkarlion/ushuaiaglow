/**
 * KPICardsSkeleton Component
 * Admin Analytics Dashboard - Phase 2
 * Loading skeleton for KPI cards grid
 */

export default function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-surface-darker/50 rounded-2xl border border-white/5 p-5 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-10 w-10 bg-white/10 rounded-xl" />
          </div>

          {/* Value */}
          <div className="space-y-2">
            <div className="h-8 w-32 bg-white/10 rounded" />
            <div className="h-3 w-20 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
