/**
 * useAnalytics Hook
 * Admin Analytics Dashboard - Phase 1
 * Custom hook using SWR for data fetching with caching and retry
 */

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { AnalyticsResponse, AnalyticsQueryParams } from '@/types/analytics';

const fetcher = async (url: string): Promise<AnalyticsResponse> => {
  const response = await fetch(url);

  // Handle 400 errors with specific message
  if (response.status === 400) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Invalid parameters');
  }

  // Handle other errors
  if (!response.ok) {
    throw new Error('Failed to fetch analytics data');
  }

  return response.json();
};

interface UseAnalyticsOptions {
  period?: 'today' | '7d' | '30d';
  startDate?: string;
  endDate?: string;
  limit?: number;
  // SWR options
  revalidateOnFocus?: boolean;
  dedupingInterval?: number;
}

interface UseAnalyticsReturn {
  data: AnalyticsResponse | undefined;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  // Actions
  setPeriod: (period: 'today' | '7d' | '30d') => void;
  setCustomRange: (startDate: string, endDate: string) => void;
  refresh: () => void;
  // Helpers
  hasError: boolean;
  hasData: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const router = useRouter();

  // Build query string from options
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (options.period) {
      params.set('period', options.period);
    }

    if (options.startDate && options.endDate) {
      params.set('startDate', options.startDate);
      params.set('endDate', options.endDate);
    }

    if (options.limit) {
      params.set('limit', String(options.limit));
    }

    return params.toString();
  }, [options.period, options.startDate, options.endDate, options.limit]);

  // Build URL
  const apiUrl = `/api/analytics${queryParams ? `?${queryParams}` : ''}`;

  // SWR hook with automatic retry
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR<AnalyticsResponse, Error>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: options.revalidateOnFocus ?? false,
      dedupingInterval: options.dedupingInterval ?? 5000,
      // Error retry: 3 retries with exponential backoff
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Update URL when period changes (client-side navigation)
  const setPeriod = useCallback((period: 'today' | '7d' | '30d') => {
    const params = new URLSearchParams();
    params.set('period', period);
    router.push(`/admin/estadisticas?${params.toString()}`, { scroll: false });
  }, [router]);

  // Update URL for custom date range
  const setCustomRange = useCallback((startDate: string, endDate: string) => {
    const params = new URLSearchParams();
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    router.push(`/admin/estadisticas?${params.toString()}`, { scroll: false });
  }, [router]);

  // Manual refresh - revalidates the current key
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    data,
    error: error ?? null,
    isLoading,
    isValidating,
    setPeriod,
    setCustomRange,
    refresh,
    hasError: !!error,
    hasData: !!data,
  };
}

// Hook for getting analytics from URL params
export function useAnalyticsFromUrl(searchParams: URLSearchParams): UseAnalyticsReturn {
  const periodParam = searchParams.get('period');
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  // Determine period: if URL has valid period, use it. Otherwise use custom dates if provided, or default to '7d'
  let period: 'today' | '7d' | '30d' | undefined;
  
  if (periodParam === 'today' || periodParam === '7d' || periodParam === '30d') {
    period = periodParam;
  } else if (!startDate || !endDate) {
    // No period in URL and no custom dates -> default to '7d'
    period = '7d';
  }

  return useAnalytics({
    period,
    startDate,
    endDate,
    limit,
  });
}

export default useAnalytics;