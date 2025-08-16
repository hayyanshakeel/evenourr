import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '30d';
    
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }

    // Fetch comprehensive analytics
    const [
      // Revenue metrics
      totalRevenue,
      previousRevenue,
      
      // Order metrics
      totalOrders,
      previousOrders,
      avgOrderValue,
      
      // Customer metrics
      totalCustomers,
      previousCustomers,
      
      // Product metrics
      totalProducts,
      activeProducts,
      
      // Top performing data
      topProducts,
      recentOrders,
      
      // Daily breakdown
      dailyMetrics
    ] = await Promise.all([
      // Revenue current period
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        },
        _sum: { totalPrice: true }
      }),

      // Revenue previous period
      prisma.order.aggregate({
        where: {
          createdAt: { gte: previousStartDate, lt: startDate },
          status: { not: 'cancelled' }
        },
        _sum: { totalPrice: true }
      }),

      // Orders current period
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      }),

      // Orders previous period
      prisma.order.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } }
      }),

      // Average order value
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        },
        _avg: { totalPrice: true }
      }),

      // Customers current period
      prisma.customer.count({
        where: { createdAt: { gte: startDate } }
      }),

      // Customers previous period
      prisma.customer.count({
        where: { createdAt: { gte: previousStartDate, lt: startDate } }
      }),

      // Total products
      prisma.product.count(),

      // Active products (with recent orders)
      prisma.product.count({
        where: {
          orderItems: {
            some: {
              order: {
                createdAt: { gte: startDate }
              }
            }
          }
        }
      }),

      // Top products by revenue
      prisma.$queryRaw<Array<{
        productId: string;
        name: string;
        revenue: number;
        quantity: number;
      }>>`
        SELECT 
          p.id as productId,
          p.name,
          SUM(oi.price * oi.quantity) as revenue,
          SUM(oi.quantity) as quantity
        FROM Product p
        JOIN OrderItem oi ON p.id = oi.productId
        JOIN \`Order\` o ON oi.orderId = o.id
        WHERE o.createdAt >= ${startDate.toISOString()}
          AND o.status != 'cancelled'
        GROUP BY p.id, p.name
        ORDER BY revenue DESC
        LIMIT 5
      `,

      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { createdAt: { gte: startDate } },
        include: {
          customer: { select: { name: true, email: true } },
          orderItems: { include: { product: { select: { name: true } } } }
        }
      }),

      // Daily metrics for the period
      prisma.$queryRaw<Array<{
        date: string;
        revenue: number;
        orders: number;
        customers: number;
      }>>`
        SELECT 
          DATE(o.createdAt) as date,
          SUM(CASE WHEN o.status != 'cancelled' THEN o.totalPrice ELSE 0 END) as revenue,
          COUNT(o.id) as orders,
          COUNT(DISTINCT o.customerId) as customers
        FROM \`Order\` o
        WHERE o.createdAt >= ${startDate.toISOString()}
        GROUP BY DATE(o.createdAt)
        ORDER BY date ASC
      `
    ]);

    // Calculate metrics
    const currentRevenue = totalRevenue._sum.totalPrice || 0;
    const prevRevenue = previousRevenue._sum.totalPrice || 0;
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    const orderGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;
    const customerGrowth = previousCustomers > 0 ? ((totalCustomers - previousCustomers) / previousCustomers) * 100 : 0;

    const currentAOV = avgOrderValue._avg.totalPrice || 0;
    
    // Estimate conversion rate (visitors to customers ratio - simplified)
    const estimatedVisitors = Math.max(totalOrders * 28.5, totalCustomers * 30); // Assume ~3.5% conversion rate
    const conversionRate = estimatedVisitors > 0 ? (totalCustomers / estimatedVisitors) * 100 : 0;

    return NextResponse.json({
      overview: {
        revenue: {
          current: currentRevenue,
          previous: prevRevenue,
          growth: revenueGrowth
        },
        orders: {
          current: totalOrders,
          previous: previousOrders,
          growth: orderGrowth
        },
        customers: {
          current: totalCustomers,
          previous: previousCustomers,
          growth: customerGrowth
        },
        averageOrderValue: currentAOV,
        conversionRate: conversionRate,
        products: {
          total: totalProducts,
          active: activeProducts
        }
      },
      topProducts: topProducts.map(p => ({
        id: p.productId,
        name: p.name,
        revenue: Number(p.revenue),
        quantity: Number(p.quantity)
      })),
      recentActivity: recentOrders.map(order => ({
        id: order.id,
        customer: order.customer?.name || 'Guest',
        total: order.totalPrice,
        status: order.status,
        date: order.createdAt,
        itemCount: order.orderItems.length
      })),
      dailyTrends: dailyMetrics.map(d => ({
        date: d.date,
        revenue: Number(d.revenue),
        orders: Number(d.orders),
        customers: Number(d.customers)
      })),
      timeframe: timeframe,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Overview analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
