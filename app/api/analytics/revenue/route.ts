import { NextRequest, NextResponse } from 'next/server';
import { requireEVRAdmin } from '@/lib/enterprise-auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const verification = await requireEVRAdmin(request);
    if ('error' in result) {
      return NextResponse.json({ error: verification.error || 'Unauthorized' }, { status: result.status });
    }
    const { user } = verification;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '30d';
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch revenue data
    const [
      totalRevenue,
      totalOrders,
      avgOrderValue,
      dailyData,
      topProducts
    ] = await Promise.all([
      // Total revenue for the period
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        },
        _sum: { totalPrice: true }
      }),

      // Total orders for the period
      prisma.order.count({
        where: { 
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        }
      }),

      // Average order value
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { not: 'cancelled' }
        },
        _avg: { totalPrice: true }
      }),

      // Daily revenue breakdown
      prisma.$queryRaw<Array<{
        date: string;
        revenue: number;
        orders: number;
        averageOrderValue: number;
      }>>`
        SELECT 
          DATE(o.createdAt) as date,
          SUM(CASE WHEN o.status != 'cancelled' THEN o.totalPrice ELSE 0 END) as revenue,
          COUNT(CASE WHEN o.status != 'cancelled' THEN o.id END) as orders,
          AVG(CASE WHEN o.status != 'cancelled' THEN o.totalPrice END) as averageOrderValue
        FROM \`Order\` o
        WHERE o.createdAt >= ${startDate.toISOString()}
        GROUP BY DATE(o.createdAt)
        ORDER BY date ASC
      `,

      // Top products by revenue
      prisma.$queryRaw<Array<{
        id: string;
        name: string;
        basePrice: number;
        totalRevenue: number;
        totalQuantity: number;
      }>>`
        SELECT 
          p.id,
          p.name,
          p.basePrice,
          SUM(oi.price * oi.quantity) as totalRevenue,
          SUM(oi.quantity) as totalQuantity
        FROM Product p
        JOIN OrderItem oi ON p.id = oi.productId
        JOIN \`Order\` o ON oi.orderId = o.id
        WHERE o.createdAt >= ${startDate.toISOString()}
          AND o.status != 'cancelled'
        GROUP BY p.id, p.name, p.basePrice
        ORDER BY totalRevenue DESC
        LIMIT 10
      `
    ]);

    const currentRevenue = totalRevenue._sum.totalPrice || 0;
    const currentAOV = avgOrderValue._avg.totalPrice || 0;

    // Calculate recurring revenue (simplified estimation)
    const recurringRevenue = currentRevenue * 0.3; // Assume 30% is recurring
    const recurringPercentage = currentRevenue > 0 ? (recurringRevenue / currentRevenue) * 100 : 0;

    // Calculate ARPU (Average Revenue Per User)
    const uniqueCustomers = await prisma.order.groupBy({
      by: ['customerId'],
      where: {
        createdAt: { gte: startDate },
        status: { not: 'cancelled' }
      }
    });
    const arpu = uniqueCustomers.length > 0 ? currentRevenue / uniqueCustomers.length : 0;

    return NextResponse.json({
      summary: {
        totalRevenue: currentRevenue,
        recurringRevenue: recurringRevenue,
        recurringPercentage: recurringPercentage,
        totalOrders: totalOrders,
        arpu: arpu,
        averageOrderValue: currentAOV
      },
      dailyData: dailyData.map(d => ({
        date: d.date,
        revenue: Number(d.revenue),
        orders: Number(d.orders),
        averageOrderValue: Number(d.averageOrderValue) || 0
      })),
      topProducts: topProducts.map(p => ({
        id: p.id,
        name: p.name,
        basePrice: Number(p.basePrice),
        totalRevenue: Number(p.totalRevenue),
        totalQuantity: Number(p.totalQuantity)
      })),
      timeframe: timeframe
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
