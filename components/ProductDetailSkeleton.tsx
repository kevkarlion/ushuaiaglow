'use client';

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 md:pb-8">
      {/* Mobile breadcrumb skeleton */}
      <div className="md:hidden px-4 py-3 border-b border-black/[0.06] bg-white">
        <div className="h-3 w-32 bg-black/5 rounded animate-pulse" />
      </div>

      {/* Desktop Layout (hidden on mobile) */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 pt-8">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left - Image skeleton */}
          <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="w-full h-full bg-[#f0f0f0] animate-pulse" />
          </div>

          {/* Right - Info skeleton */}
          <div className="space-y-7 pt-2">
            {/* Category + Brand */}
            <div className="flex items-center gap-3">
              <div className="h-3 w-24 bg-black/5 rounded animate-pulse" />
              <div className="h-3 w-3 bg-black/5 rounded-full animate-pulse" />
              <div className="h-3 w-16 bg-black/5 rounded animate-pulse" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-black/5 rounded-lg animate-pulse" />
              <div className="h-8 w-1/2 bg-black/5 rounded-lg animate-pulse" />
            </div>

            {/* Tagline */}
            <div className="h-4 w-full bg-black/5 rounded animate-pulse" />

            {/* Rating */}
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-4 bg-black/5 rounded animate-pulse" />
              ))}
              <div className="h-3 w-24 bg-black/5 rounded animate-pulse" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <div className="h-10 w-32 bg-black/5 rounded-lg animate-pulse" />
              <div className="h-6 w-20 bg-black/5 rounded animate-pulse" />
            </div>

            {/* Cuotas */}
            <div className="h-10 w-56 bg-white border border-black/[0.06] rounded-xl animate-pulse" />

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <div className="h-4 w-16 bg-black/5 rounded animate-pulse" />
              <div className="h-12 w-32 bg-white border border-black/[0.06] rounded-xl animate-pulse" />
            </div>

            {/* CTA */}
            <div className="h-14 w-full bg-black/5 rounded-xl animate-pulse" />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.06]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-black/5 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-black/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description section skeleton */}
        <div className="mt-16 space-y-12">
          <div className="space-y-6">
            <div className="h-8 w-32 bg-black/5 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-black/5 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-black/5 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-black/5 rounded animate-pulse" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-black/[0.06] shadow-sm">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-4 w-4 bg-black/5 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-black/5 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Benefits skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-24 bg-black/5 rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-black/[0.06] shadow-sm">
                  <div className="h-6 w-6 mx-auto mb-3 bg-black/5 rounded animate-pulse" />
                  <div className="h-3 w-20 mx-auto bg-black/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews skeleton */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 w-20 bg-black/5 rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-black/5 rounded animate-pulse" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-black/[0.06] shadow-sm space-y-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-3 w-3 bg-black/5 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-black/5 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-black/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-16 space-y-6">
          <div className="h-8 w-48 bg-black/5 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-black/[0.06] shadow-sm">
                <div className="aspect-square bg-[#f0f0f0] rounded-t-xl animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-black/5 rounded animate-pulse" />
                  <div className="h-5 w-20 bg-black/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Hero Image skeleton */}
        <div className="relative aspect-square bg-[#f0f0f0] animate-pulse" />

        {/* Info skeleton */}
        <div className="px-4 py-5 space-y-4 bg-white">
          {/* Category */}
          <div className="h-3 w-20 bg-black/5 rounded animate-pulse" />
          
          {/* Title */}
          <div className="h-6 w-3/4 bg-black/5 rounded animate-pulse" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 bg-black/5 rounded animate-pulse" />
            ))}
            <div className="h-3 w-16 bg-black/5 rounded animate-pulse" />
          </div>

          {/* Price */}
          <div className="h-8 w-28 bg-black/5 rounded animate-pulse" />

          {/* Cuotas */}
          <div className="h-8 w-40 bg-white border border-black/[0.06] rounded-lg animate-pulse" />
        </div>

        {/* Mobile description sections skeleton */}
        <div className="px-4 py-6 border-t border-black/[0.06] bg-white space-y-4">
          <div className="h-5 w-24 bg-black/5 rounded animate-pulse" />
          <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-black/5 rounded animate-pulse" />
          <div className="bg-white rounded-xl p-4 border border-black/[0.06] shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-black/5 rounded animate-pulse" />
              <div className="h-4 w-16 bg-black/5 rounded animate-pulse" />
            </div>
            <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
