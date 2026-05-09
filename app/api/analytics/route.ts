import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import type { AnalyticsResponse, DateRange, SaleStatus } from '@/types/analytics';

// MongoDB connection
let client: MongoClient | null = null;

async function getClient() {
  const mongoUri = process.env.MONGODB_URI || '';
  if (!mongoUri || mongoUri.includes('your_password') || mongoUri.length < 20) {
    throw new Error('MongoDB no configurada');
  }
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client;
}

// Calculate date range based on period or custom dates
function calculateDateRange(
  period?: string,
  startDate?: string,
  endDate?: string
): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let start: Date;
  let end: Date = now;

  if (startDate && endDate) {
    // Custom date range
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'today') {
    start = today;
  } else if (period === '7d') {
    start = new Date(today);
    start.setDate(start.getDate() - 6);
  } else if (period === '30d') {
    start = new Date(today);
    start.setDate(start.getDate() - 29);
  } else {
    // Default to 7 days
    start = new Date(today);
    start.setDate(start.getDate() - 6);
  }

  // Calculate previous period for comparison
  const rangeDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const previousEnd = new Date(start);
  previousEnd.setDate(previousEnd.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - (rangeDays - 1));

  return { start, end, previousStart, previousEnd };
}

// Format date to DD/MM for Argentine format
function formatDateDDMM(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

// Ensure index exists on sales collection
async function ensureIndexes(mongoClient: MongoClient) {
  const salesCollection = mongoClient.db('ushuaia').collection('sales');

  const indexes = await salesCollection.indexes();
  const hasCompoundIndex = indexes.some(
    (idx: any) =>
      idx.key?.createdAt === 1 && idx.key?.status === 1
  );

  if (!hasCompoundIndex) {
    await salesCollection.createIndex({ createdAt: 1, status: 1 });
    console.log('Created index on sales: { createdAt: 1, status: 1 }');
  }
}

// GET endpoint - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const period = searchParams.get('period') as 'today' | '7d' | '30d' | null;
    const startDateParam = searchParams.get('startDate') || undefined;
    const endDateParam = searchParams.get('endDate') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 20, 100) : 20;

    // Validate: either period OR (startDate AND endDate) must be provided
    if (!period && (!startDateParam || !endDateParam)) {
      return NextResponse.json(
        { error: "Missing required parameters: either 'period' or 'startDate' and 'endDate' are required" },
        { status: 400 }
      );
    }

    const dateRange = calculateDateRange(period || undefined, startDateParam, endDateParam);
    const mongoClient = await getClient();

    // Ensure indexes exist
    await ensureIndexes(mongoClient);

    const salesCollection = mongoClient.db('ushuaia').collection('sales');

    // Main aggregation with $facet for parallel operations
    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: dateRange.start,
            $lt: dateRange.end
          }
        }
      },
      {
        $facet: {
          // KPI metrics (only paid orders for revenue, all for status breakdown)
          kpis: [
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'paid'] }, '$total', 0]
                  }
                },
                paidOrders: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'paid'] }, 1, 0]
                  }
                },
                failedOrders: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
                paidOrders: 1,
                failedOrders: 1,
                aov: {
                  $cond: [
                    { $gt: ['$paidOrders', 0] },
                    { $divide: ['$totalRevenue', '$paidOrders'] },
                    0
                  ]
                }
              }
            }
          ],
          // Revenue chart by day
          revenueChart: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$createdAt'
                  }
                },
                revenue: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'paid'] }, '$total', 0]
                  }
                },
                orders: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'paid'] }, 1, 0]
                  }
                }
              }
            },
            { $sort: { _id: 1 } }
          ],
          // Top products by revenue
          topProducts: [
            { $unwind: '$items' },
            {
              $match: {
                status: 'paid'
              }
            },
            {
              $group: {
                _id: '$items.productId',
                title: { $first: '$items.title' },
                quantity: { $sum: '$items.quantity' },
                revenue: {
                  $sum: {
                    $multiply: ['$items.price', '$items.quantity']
                  }
                }
              }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                title: 1,
                quantity: 1,
                revenue: 1
              }
            }
          ],
          // Status breakdown (all statuses in period)
          statusBreakdown: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                status: '$_id',
                count: 1
              }
            }
          ],
          // Recent sales
          recentSales: [
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                buyerNombre: 1,
                total: 1,
                status: 1,
                createdAt: 1,
                items: 1
              }
            }
          ],
          // Previous period for comparison
          previousPeriod: [
            {
              $match: {
                status: 'paid',
                createdAt: {
                  $gte: dateRange.previousStart,
                  $lt: dateRange.previousEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
                paidOrders: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
                paidOrders: 1,
                aov: {
                  $cond: [
                    { $gt: ['$paidOrders', 0] },
                    { $divide: ['$totalRevenue', '$paidOrders'] },
                    0
                  ]
                }
              }
            }
          ]
        }
      }
    ];

    const result = await salesCollection.aggregate(pipeline).toArray();

    if (!result || result.length === 0) {
      return NextResponse.json({
        kpis: {
          totalRevenue: 0,
          paidOrders: 0,
          failedOrders: 0,
          aov: 0,
          pendingOrders: 0
        },
        revenueChart: [],
        topProducts: [],
        statusBreakdown: [],
        recentSales: []
      } as AnalyticsResponse);
    }

    const data = result[0];

    // Process KPIs
    const kpisData = data.kpis[0] || {
      totalRevenue: 0,
      paidOrders: 0,
      failedOrders: 0,
      aov: 0,
      pendingOrders: 0
    };

    const previousData = data.previousPeriod[0] || {
      totalRevenue: 0,
      paidOrders: 0,
      aov: 0
    };

    // Calculate percentage changes
    const revenueChange = previousData.totalRevenue > 0
      ? ((kpisData.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue) * 100
      : kpisData.totalRevenue > 0 ? 100 : 0;

    const ordersChange = previousData.paidOrders > 0
      ? ((kpisData.paidOrders - previousData.paidOrders) / previousData.paidOrders) * 100
      : kpisData.paidOrders > 0 ? 100 : 0;

    const aovChange = previousData.aov > 0
      ? ((kpisData.aov - previousData.aov) / previousData.aov) * 100
      : kpisData.aov > 0 ? 100 : 0;

    // Process revenue chart - format dates to DD/MM
    const revenueChart = (data.revenueChart || []).map((item: any) => ({
      date: formatDateDDMM(new Date(item._id)),
      revenue: item.revenue,
      orders: item.orders
    }));

    // Process status breakdown
    const statusBreakdown = (data.statusBreakdown || []).map((item: any) => ({
      status: item.status as SaleStatus,
      count: item.count
    }));

    // Process recent sales
    const recentSales = (data.recentSales || []).map((sale: any) => ({
      id: sale._id?.toString() || '',
      buyer: sale.buyerNombre || 'Sin nombre',
      total: sale.total || 0,
      status: sale.status as SaleStatus,
      createdAt: sale.createdAt?.toISOString() || new Date().toISOString(),
      items: (sale.items || []).map((item: any) => ({
        productId: item.productId || '',
        title: item.title || '',
        price: item.price || 0,
        quantity: item.quantity || 0
      }))
    }));

    // Build response
    const response: AnalyticsResponse = {
      kpis: {
        totalRevenue: kpisData.totalRevenue || 0,
        paidOrders: kpisData.paidOrders || 0,
        failedOrders: kpisData.failedOrders || 0,
        aov: kpisData.aov || 0,
        pendingOrders: kpisData.pendingOrders || 0,
        previousTotalRevenue: previousData.totalRevenue,
        previousPaidOrders: previousData.paidOrders,
        previousAov: previousData.aov
      },
      revenueChart,
      topProducts: data.topProducts || [],
      statusBreakdown,
      recentSales
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Unable to load analytics. Please try again.' },
      { status: 500 }
    );
  }
}