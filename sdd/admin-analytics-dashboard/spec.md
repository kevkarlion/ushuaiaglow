# Specification: Admin Analytics Dashboard

## Overview

This specification defines the requirements for the Admin Analytics Dashboard feature, enabling real-time visibility into sales performance, revenue trends, and product metrics.

---

## ADDED Requirements

### Requirement: Analytics Dashboard Page

The system MUST provide a dedicated analytics dashboard page accessible at `/admin/estadisticas` that displays KPIs, charts, and recent sales data with time-based filtering capabilities.

#### Scenario: Dashboard loads with default 7-day period

- GIVEN the user navigates to `/admin/estadisticas` without query parameters
- WHEN the page renders
- THEN it MUST display data for the last 7 days by default
- AND all KPI cards, charts, and table MUST show data for this period

#### Scenario: Dashboard loads with custom date range

- GIVEN the user navigates to `/admin/estadisticas?from=2024-01-01&to=2024-01-31`
- WHEN the page renders
- THEN it MUST display data for the specified custom range
- AND the date range filter UI MUST indicate the selected custom range

#### Scenario: Time filter changes update dashboard without page reload

- GIVEN the user is on the analytics dashboard viewing 7-day data
- WHEN the user selects "30 days" from the time filter
- THEN all KPIs, charts, and recent sales table MUST update to show 30-day data
- AND the URL MUST update to `?period=30d`
- AND the page MUST NOT reload (client-side navigation)

---

### Requirement: Analytics API Endpoint

The system MUST provide a GET endpoint at `/api/analytics` that returns aggregated sales metrics based on query parameters.

#### API Contract

**Endpoint**: `GET /api/analytics`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No* | Predefined period: `today`, `7d`, `30d` |
| `startDate` | string | No* | ISO date string (YYYY-MM-DD) |
| `endDate` | string | No* | ISO date string (YYYY-MM-DD) |
| `limit` | number | No | Number of recent sales to return (default: 20, max: 100) |

*Either `period` OR (`startDate` AND `endDate`) MUST be provided.

#### Full Response Format

```json
{
  "period": { "start": "2024-01-01", "end": "2024-01-31", "type": "custom" },
  "metrics": {
    "totalRevenue": 45000.00,
    "ordersCount": 150,
    "averageOrderValue": 300.00,
    "conversionRate": 3.5,
    "previousPeriod": {
      "totalRevenue": 38000.00,
      "ordersCount": 120,
      "averageOrderValue": 316.67
    }
  },
  "chartData": [
    { "date": "2024-01-01", "revenue": 1500.00, "orders": 12 },
    { "date": "2024-01-02", "revenue": 2300.50, "orders": 18 }
  ],
  "topProducts": [
    { "productId": "prod_001", "productName": "Product A", "quantitySold": 150, "revenue": 4500.00 },
    { "productId": "prod_002", "productName": "Product B", "quantitySold": 120, "revenue": 3600.00 }
  ],
  "orderStatusBreakdown": [
    { "status": "paid", "count": 150, "percentage": 75 },
    { "status": "pending", "count": 30, "percentage": 15 },
    { "status": "cancelled", "count": 15, "percentage": 7.5 },
    { "status": "refunded", "count": 5, "percentage": 2.5 }
  ],
  "recentSales": [
    {
      "id": "sale_abc123",
      "buyerName": "Juan Pérez",
      "total": 250.00,
      "status": "paid",
      "items": [{ "productId": "prod_001", "productName": "Product A", "quantity": 2, "price": 125.00 }],
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ],
  "pagination": { "total": 150, "limit": 20, "offset": 0, "hasMore": true }
}
```

#### Scenario: API returns metrics for predefined period

- GIVEN a request to `/api/analytics?period=7d`
- WHEN the server processes the request
- THEN it MUST return aggregated metrics for the last 7 days
- AND include revenue, orders count, AOV, and top products

#### Scenario: API returns metrics for custom date range

- GIVEN a request to `/api/analytics?startDate=2024-01-01&endDate=2024-01-31`
- WHEN the server processes the request
- THEN it MUST return aggregated metrics for the specified range
- AND ignore any `period` parameter if provided

#### Scenario: API returns 400 for invalid parameters

- GIVEN a request to `/api/analytics` without period or date range
- WHEN the server validates the request
- THEN it MUST return HTTP 400 with error message "Missing required parameters: either 'period' or 'startDate' and 'endDate' are required"

#### Scenario: API handles large datasets efficiently

- GIVEN a request for 30-day analytics on a database with 100,000+ sales records
- WHEN the aggregation pipeline executes
- THEN the response MUST return within 2 seconds
- AND the API MUST use indexed fields (`createdAt`, `status`) for filtering

---

### Requirement: KPI Cards Component

The system MUST display four KPI cards showing: Total Revenue, Orders Count, Average Order Value (AOV), and Conversion Rate. Each card MUST show the current period value and comparison to the previous period.

#### Data Requirements

| KPI | Field | Calculation | Format |
|-----|-------|-------------|--------|
| Total Revenue | `totalRevenue` | Sum of `total` where `status` = `paid` | Currency |
| Orders Count | `ordersCount` | Count of sales where `status` = `paid` | Number |
| AOV | `averageOrderValue` | `totalRevenue` / `ordersCount` | Currency |
| Conversion Rate | `conversionRate` | (paid orders / total visitors) × 100 | Percentage |

#### Scenario: KPI cards display correct values

- GIVEN sales data exists for the selected period
- WHEN the dashboard renders
- THEN Total Revenue MUST equal sum of all paid sales totals
- AND Orders Count MUST equal count of all paid sales
- AND AOV MUST equal Total Revenue divided by Orders Count

#### Scenario: KPI cards show period comparison

- GIVEN the user selects a time period
- WHEN the dashboard renders
- THEN each KPI card MUST display a percentage change indicator
- AND green up arrow for positive change vs previous period
- AND red down arrow for negative change vs previous period

---

### Requirement: Revenue Chart Component

The system MUST display a line chart showing revenue over the selected time period, with data points aggregated by day.

#### Data Structure

```typescript
interface RevenueDataPoint {
  date: string;    // ISO date (YYYY-MM-DD)
  revenue: number; // Total revenue for that day
  orders: number;  // Number of orders that day
}
```

#### Scenario: Revenue chart renders with correct data points

- GIVEN sales data exists for the selected period
- WHEN the revenue chart renders
- THEN it MUST display one data point per day
- AND each point MUST show the aggregated revenue for that day
- AND the line MUST connect all points in chronological order

#### Scenario: Revenue chart handles days with no sales

- GIVEN a date range where some days have no sales
- WHEN the chart renders
- THEN those days MUST display with revenue: 0
- AND the chart line MUST show a drop to zero (not skip the day)

---

### Requirement: Top Products Chart Component

The system MUST display a horizontal bar chart showing the top 10 products by sales volume.

#### Data Structure

```typescript
interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}
```

#### Scenario: Top products chart shows top 10 products

- GIVEN sales data exists for the selected period
- WHEN the chart renders
- THEN it MUST display exactly 10 bars (or fewer if less than 10 products exist)
- AND bars MUST be sorted by revenue descending (highest at top)
- AND each bar MUST show product name and revenue amount

#### Scenario: Product names are truncated for long titles

- GIVEN a product with a name longer than 30 characters
- WHEN the chart renders the product name
- THEN it MUST truncate with ellipsis after 30 characters
- AND tooltip MUST show the full product name on hover

---

### Requirement: Order Status Chart Component

The system MUST display a pie/donut chart showing the distribution of orders by status.

#### Data Structure

```typescript
interface OrderStatusData {
  status: 'paid' | 'pending' | 'cancelled' | 'refunded';
  count: number;
  percentage: number;
  color: string;
}
```

#### Scenario: Order status chart shows correct distribution

- GIVEN sales data exists for the selected period
- WHEN the chart renders
- THEN it MUST show all four statuses
- AND each segment MUST be sized proportionally to its percentage
- AND total percentages MUST equal 100%

---

### Requirement: Recent Sales Table Component

The system MUST display a table showing the most recent sales, ordered by creation date descending.

#### Data Structure

```typescript
interface RecentSale {
  id: string;
  buyerName: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string; // ISO datetime
}
```

#### Scenario: Recent sales table displays latest orders first

- GIVEN sales exist in the database
- WHEN the table renders
- THEN rows MUST be sorted by `createdAt` descending (newest first)
- AND the default limit MUST be 20 rows

#### Scenario: Table shows all sale statuses with color coding

- GIVEN sales with various statuses exist
- WHEN the table renders
- THEN each status MUST be displayed with a color indicator:
  - `pending`: Yellow/Amber
  - `paid`: Green
  - `cancelled`: Red
  - `refunded`: Gray

---

### Requirement: Time Period Filter

The system MUST provide a filter component that allows selecting between predefined periods (today, 7 days, 30 days) or a custom date range.

#### Filter Options

| Option | Value | Description |
|--------|-------|-------------|
| Today | `today` | Current day from 00:00 to now |
| Last 7 Days | `7d` | Last 7 days including today |
| Last 30 Days | `30d` | Last 30 days including today |
| Custom | `custom` | User selects start and end dates |

#### Scenario: Custom date range picker appears when custom is selected

- GIVEN the user clicks "Custom" in the time filter
- WHEN the filter expands
- THEN two date input fields MUST appear (start date and end date)
- AND both fields MUST default to the currently selected range

#### Scenario: Invalid date range shows validation error

- GIVEN the user selects an end date before the start date
- WHEN they attempt to apply the filter
- THEN an error message MUST display: "End date must be after start date"
- AND the filter MUST NOT apply until corrected

---

### Requirement: Mobile-First Responsive Design

The analytics dashboard MUST adapt to all screen sizes, with a mobile-first approach.

#### Breakpoints

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile | < 768px | Single column, stacked cards, horizontal scroll table |
| Tablet | 768px - 1024px | 2-column KPI grid, charts fit width |
| Desktop | > 1024px | 4-column KPI grid, side-by-side charts |

#### Scenario: Mobile view stacks KPI cards vertically

- GIVEN the user views the dashboard on a mobile device (< 768px)
- WHEN the page renders
- THEN all four KPI cards MUST stack vertically (one per row)
- AND each card MUST span the full width

#### Scenario: Mobile view allows horizontal scroll for recent sales table

- GIVEN the user views the dashboard on a mobile device (< 768px)
- WHEN the recent sales table renders
- THEN the table MUST allow horizontal scroll
- AND the table columns MUST remain readable (min-width: 100px each)

#### Scenario: Charts resize responsively

- GIVEN the user resizes the browser window
- WHEN the chart container resizes
- THEN charts MUST resize proportionally using `ResponsiveContainer`
- AND charts MUST maintain a minimum height of 200px

---

### Requirement: Loading and Error States

The dashboard MUST handle loading and error states gracefully.

#### Scenario: Loading state displays while fetching data

- GIVEN the user navigates to the analytics dashboard
- WHEN the API request is in flight
- THEN skeleton loaders MUST display in place of KPI cards
- AND chart areas MUST show loading placeholders

#### Scenario: Error state displays on API failure

- GIVEN the API request fails (server error or timeout)
- WHEN the error is detected
- THEN an error message MUST display: "Unable to load analytics. Please try again."
- AND a "Retry" button MUST be available to reload the data

#### Scenario: Empty state displays when no data exists for period

- GIVEN there are no sales for the selected period
- WHEN the API returns empty data
- THEN the dashboard MUST display: "No data available for this period"
- AND charts MUST show empty state (no line, no bars)

---

## Summary

| Requirement | Type | Scenarios |
|-------------|------|-----------|
| Analytics Dashboard Page | NEW | 3 |
| Analytics API Endpoint | NEW | 4 |
| KPI Cards Component | NEW | 2 |
| Revenue Chart Component | NEW | 2 |
| Top Products Chart Component | NEW | 2 |
| Order Status Chart Component | NEW | 1 |
| Recent Sales Table Component | NEW | 2 |
| Time Period Filter | NEW | 2 |
| Mobile-First Responsive Design | NEW | 3 |
| Loading and Error States | NEW | 3 |

**Total Requirements**: 10  
**Total Scenarios**: 24

---

## Next Step

Ready for design (sdd-design). If design already exists, ready for tasks (sdd-tasks).