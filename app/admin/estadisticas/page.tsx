/**
 * Analytics Dashboard Page
 * Admin Analytics Dashboard - Phase 4
 * Main dashboard page with KPIs, charts, and recent sales
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo } from 'react';
import { useAnalytics, useAnalyticsFromUrl } from '@/hooks/useAnalytics';

// Components
import TimeFilter from '@/components/analytics/TimeFilter';
import KPICards from '@/components/analytics/KPICards';
import KPICardsError from '@/components/analytics/KPICardsError';
import KPICardsSkeleton from '@/components/analytics/KPICardsSkeleton';
import RevenueChart from '@/components/analytics/RevenueChart';
import TopProductsChart from '@/components/analytics/TopProductsChart';
import StatusPieChart from '@/components/analytics/StatusPieChart';
import RecentSalesTable from '@/components/analytics/RecentSalesTable';
import DashboardError from '@/components/analytics/DashboardError';
import DashboardSkeleton from '@/components/analytics/DashboardSkeleton';

type Period = 'today' | '7d' | '30d' | 'custom';

function EstadisticasContent() {
  const searchParams = useSearchParams();

  // Get analytics data from URL params
  const {
    data,
    error,
    isLoading,
    isValidating,
    setPeriod,
    setCustomRange,
    refresh,
    hasError,
  } = useAnalyticsFromUrl(searchParams);

  // Parse period from URL
  const activePeriod: Period = useMemo(() => {
    const period = searchParams.get('period');
    if (period === 'today' || period === '7d' || period === '30d') {
      return period;
    }
    if (searchParams.get('startDate') || searchParams.get('endDate')) {
      return 'custom';
    }
    return '7d'; // Default
  }, [searchParams]);

  // Custom range from URL
  const customRange = useMemo(() => {
    const start = searchParams.get('startDate') || '';
    const end = searchParams.get('endDate') || '';
    return start && end ? { start, end } : undefined;
  }, [searchParams]);

  // Handle period change
  const handlePeriodChange = useCallback((period: Period) => {
    if (period === 'custom') {
      // Set a default 7-day range for custom
      const end = new Date().toISOString().split('T')[0];
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setCustomRange(start, end);
    } else {
      setPeriod(period);
    }
  }, [setPeriod, setCustomRange]);

  // Handle custom range change
  const handleCustomRangeChange = useCallback((start: string, end: string) => {
    setCustomRange(start, end);
  }, [setCustomRange]);

  // Full page error state
  if (error && !data) {
    return (
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Estadísticas
          </h1>
        </div>

        <DashboardError
          message={error.message || 'Error al cargar las estadísticas'}
          onRetry={refresh}
          isRetrying={isValidating}
        />
      </div>
    );
  }

  // Loading state (initial load)
  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Estadísticas
          </h1>
        </div>

        <DashboardSkeleton />
      </div>
    );
  }

  // Extract data
  const kpis = data?.kpis;
  const revenueChart = data?.revenueChart;
  const topProducts = data?.topProducts;
  const statusBreakdown = data?.statusBreakdown;
  const recentSales = data?.recentSales;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Estadísticas
        </h1>

        {/* Time filter */}
        <TimeFilter
          activePeriod={activePeriod}
          onPeriodChange={handlePeriodChange}
          showCustom={true}
          customRange={customRange}
          onCustomRangeChange={handleCustomRangeChange}
        />
      </div>

      {/* KPI Cards */}
      {kpis ? (
        <KPICards
          kpis={kpis}
          isLoading={isValidating}
        />
      ) : (
        <KPICardsError
          message="Error al cargar los indicadores"
          onRetry={refresh}
        />
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={revenueChart}
          isLoading={isValidating}
        />
        <TopProductsChart
          data={topProducts}
          isLoading={isValidating}
        />
      </div>

      {/* Bottom row: Status pie chart + Recent sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusPieChart
          data={statusBreakdown}
          isLoading={isValidating}
        />

        <div className="lg:col-span-2">
          <RecentSalesTable
            sales={recentSales}
            isLoading={isValidating}
          />
        </div>
      </div>
    </div>
  );
}

export default function EstadisticasPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EstadisticasContent />
    </Suspense>
  );
}