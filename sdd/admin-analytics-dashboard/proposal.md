# Proposal: Admin Analytics Dashboard

## Intent

Build a comprehensive analytics dashboard for the admin panel to provide real-time visibility into sales performance, revenue trends, and product metrics. This enables data-driven decisions without needing external BI tools.

## Scope

### In Scope
- New page: `/admin/estadisticas`
- New API route: `/api/analytics` with MongoDB aggregation pipeline
- KPI cards: total revenue, orders count, AOV, conversion rate
- Charts: revenue over time (line), top products (bar), orders by status (pie)
- Recent sales table (last 20)
- Time filters: today, last 7 days, last 30 days, custom range

### Out of Scope
- Meta Ads ROAS tracking (Phase 2)
- Export to CSV/Excel (Phase 2)
- User cohort analysis (Phase 2)
- Predictive analytics

## Capabilities

### New Capabilities
- `analytics-dashboard`: Main dashboard page with KPIs, charts, and filters
- `analytics-api`: Aggregation endpoints for metrics (revenue, orders, AOV, top products)
- `revenue-chart`: Line chart showing revenue over selected time period
- `product-performance-chart`: Bar chart showing top 10 products by sales
- `order-status-chart`: Pie chart showing orders distributed by status

### Modified Capabilities
- `sale-tracking`: Extend sales API to support date-range filtering and aggregations

## Approach

1. **API `/api/analytics`**: MongoDB aggregation with `$match` for date filtering, `$group` for metrics (sum revenue, count orders, avg order value). Use `$facet` for parallel aggregations.
2. **Dashboard Page**: Server component fetching initial data, client components for interactivity
3. **Charts**: Recharts library (already compatible with React 19), responsive containers
4. **KPI Cards**: 4-card grid, each showing metric + comparison vs previous period
5. **Time Filters**: URL params (`?period=7d` or `?from=2024-01-01&to=2024-01-31`)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/admin/estadisticas/page.tsx` | New | Main analytics dashboard |
| `app/api/analytics/route.ts` | New | Aggregation API endpoint |
| `types/analytics.ts` | New | TypeScript interfaces for metrics |
| `app/admin/sales/page.tsx` | Modified | May need to ensure consistency |
| `package.json` | Modified | Add `recharts` dependency |

## Data Requirements

- **Sales Collection**: `sales` has `total`, `status`, `createdAt`, `items`
- **Metrics**: 
  - Total Revenue = sum of `total` where status = `paid` (exclude `pending`, `cancelled`)
  - Orders = count of sales in period
  - AOV = Total Revenue / Orders
  - Top Products = aggregate `items` array, group by `productId`, sum quantities

## Design Direction

- **Mobile-first**: Cards stack vertically, charts resize with `ResponsiveContainer`
- **Color palette**: Primary blue (#3B82F6), success green for positive trends, red for alerts
- **Chart style**: Clean, minimal grid lines, tooltips on hover, legends below charts
- **Typography**: Bold KPI numbers (text-3xl), labels (text-sm text-gray-500)

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Large datasets slow aggregation (>100k sales) | Medium | Add `$limit` + indexes on `createdAt`, pagination for recent sales |
| Mobile chart readability cramped | Low | Use `ResponsiveContainer` with min height 200px, swipe gestures |
| No conversion funnel data yet | High | Start with sales-only metrics; define funnel schema for Phase 2 |

## Rollback Plan

1. Delete `/admin/estadisticas` page directory
2. Delete `/api/analytics` route
3. Remove `recharts` from package.json
4. Keep sales collection intact (no destructive changes)
5. Revert any admin layout navigation additions

## Dependencies

- MongoDB with existing `sales` and `buyers` collections
- Recharts library (`npm install recharts`)
- Next.js App Router

## Success Criteria

- [ ] `/admin/estadisticas` loads within 2 seconds for 30-day range
- [ ] KPI cards show accurate totals matching manual database query
- [ ] Revenue chart renders with smooth animation
- [ ] Time filter changes update all metrics without page reload
- [ ] Mobile view (< 768px) shows stacked cards and horizontal scroll for table
- [ ] No console errors in production build