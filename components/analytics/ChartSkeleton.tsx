/**
 * ChartSkeleton Component
 * Admin Analytics Dashboard - Phase 3
 * Loading skeleton for chart components
 */

export default function ChartSkeleton() {
  return (
    <div className="bg-surface-darker/50 rounded-2xl border border-white/5 p-5 animate-pulse">
      {/* Header skeleton */}
      <div className="h-5 w-36 bg-white/10 rounded mb-4" />

      {/* Chart area skeleton */}
      <div className="h-[200px] w-full flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-8 border-white/5" />
          {/* Inner circle */}
          <div className="absolute inset-8 rounded-full bg-surface-darker/80" />
          {/* Placeholder bars below */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1.5">
            {[40, 60, 45, 70, 55].map((h, i) => (
              <div
                key={i}
                className="w-3 bg-white/5 rounded-t"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}