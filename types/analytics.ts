/**
 * Analytics Dashboard TypeScript Interfaces
 * Admin Analytics Dashboard - Phase 1
 */

// Sale status types (matches existing sale.ts)
export type SaleStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

// KPI Metrics
export interface KPIMetrics {
  totalRevenue: number;
  paidOrders: number;
  failedOrders: number;
  aov: number;
  pendingOrders: number;
  // Previous period comparison (percentage change)
  previousTotalRevenue?: number;
  previousPaidOrders?: number;
  previousAov?: number;
}

// Revenue chart data point
export interface ChartDataPoint {
  date: string; // ISO date YYYY-MM-DD, displayed as DD/MM
  revenue: number;
  orders: number;
}

// Top product data
export interface TopProduct {
  title: string;
  quantity: number;
  revenue: number;
}

// Status breakdown item
export interface StatusBreakdown {
  status: SaleStatus;
  count: number;
}

// Recent sale item (matches existing SaleItem from sale.ts)
export interface SaleItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

// Recent sale entry
export interface RecentSale {
  id: string;
  buyer: string;
  total: number;
  status: SaleStatus;
  createdAt: string;
  items: SaleItem[];
}

// Complete analytics response
export interface AnalyticsResponse {
  kpis: KPIMetrics;
  revenueChart: ChartDataPoint[];
  topProducts: TopProduct[];
  statusBreakdown: StatusBreakdown[];
  recentSales: RecentSale[];
}

// Query parameters for API
export interface AnalyticsQueryParams {
  period?: 'today' | '7d' | '30d';
  startDate?: string; // ISO date string YYYY-MM-DD
  endDate?: string; // ISO date string YYYY-MM-DD
  limit?: number;
}

// Date range for calculations
export interface DateRange {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
}