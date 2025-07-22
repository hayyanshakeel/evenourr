import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { products, orders, customers, coupons, orderItems } from '@/lib/schema';
import { eq, gte, and, sql } from 'drizzle-orm';

/**
 * GET /api/dashboard/stats - Fetch dashboard statistics
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    const startDateStr = startDate.toISOString();

    // Get total products count
    const productsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.status, 'active'));

    // Get total customers count
    const customersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.state, 'enabled'));

    // Get orders statistics for the period
    const ordersStats = await db
      .select({
        count: sql<number>`count(*)`,
        totalRevenue: sql<number>`sum(${orders.total})`,
        avgOrderValue: sql<number>`avg(${orders.total})`
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, startDateStr),
          eq(orders.status, 'delivered')
        )
      );

    // Get pending orders count
    const pendingOrdersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, 'pending'));

    // Get active coupons count
    const activeCouponsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons)
      .where(eq(coupons.status, 'active'));

    // Get top selling products
    const topProducts = await db
      .select({
        productId: orderItems.productId,
        title: orderItems.title,
        totalSold: sql<number>`sum(${orderItems.quantity})`,
        revenue: sql<number>`sum(${orderItems.price} * ${orderItems.quantity})`
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          gte(orders.createdAt, startDateStr),
          eq(orders.status, 'delivered')
        )
      )
      .groupBy(orderItems.productId, orderItems.title)
      .orderBy(sql`sum(${orderItems.quantity}) DESC`)
      .limit(5);

    // Get recent orders
    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerEmail: orders.email,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt
      })
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    // Get revenue by day for chart
    const revenueByDay = await db
      .select({
        date: sql<string>`date(${orders.createdAt})`,
        revenue: sql<number>`sum(${orders.total})`,
        orderCount: sql<number>`count(*)`
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, startDateStr),
          eq(orders.status, 'delivered')
        )
      )
      .groupBy(sql`date(${orders.createdAt})`)
      .orderBy(sql`date(${orders.createdAt})`);

    // Calculate growth rates (compare with previous period)
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(period));
    const previousStartDateStr = previousStartDate.toISOString();

    const previousOrdersStats = await db
      .select({
        count: sql<number>`count(*)`,
        totalRevenue: sql<number>`sum(${orders.total})`
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, previousStartDateStr),
          sql`${orders.createdAt} < ${startDateStr}`,
          eq(orders.status, 'delivered')
        )
      );

    const currentRevenue = ordersStats[0]?.totalRevenue || 0;
    const previousRevenue = previousOrdersStats[0]?.totalRevenue || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const currentOrderCount = ordersStats[0]?.count || 0;
    const previousOrderCount = previousOrdersStats[0]?.count || 0;
    const orderGrowth = previousOrderCount > 0 
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 
      : 0;

    return NextResponse.json({
      overview: {
        totalRevenue: ordersStats[0]?.totalRevenue || 0,
        totalOrders: ordersStats[0]?.count || 0,
        avgOrderValue: ordersStats[0]?.avgOrderValue || 0,
        totalProducts: productsCount[0]?.count || 0,
        totalCustomers: customersCount[0]?.count || 0,
        pendingOrders: pendingOrdersCount[0]?.count || 0,
        activeCoupons: activeCouponsCount[0]?.count || 0
      },
      growth: {
        revenueGrowth: revenueGrowth.toFixed(2),
        orderGrowth: orderGrowth.toFixed(2)
      },
      topProducts,
      recentOrders,
      revenueByDay,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
