import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sum, count, sql } from 'drizzle-orm';
import { orders, customers } from '@/lib/db/schema';

export async function GET() {
  try {
    const totalRevenueResult = await db.select({ total: sum(orders.total) }).from(orders).where(sql`${orders.status} = 'delivered'`);
    const totalRevenue = parseFloat(totalRevenueResult[0]?.total || '0');

    const totalSalesResult = await db.select({ count: count() }).from(orders);
    const totalSales = totalSalesResult[0]?.count || 0;

    const totalCustomersResult = await db.select({ count: count() }).from(customers);
    const totalCustomers = totalCustomersResult[0]?.count || 0;

    const recentOrders = await db.query.orders.findMany({
      limit: 5,
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: { customer: true },
    });

    return NextResponse.json({
      totalRevenue: totalRevenue / 100,
      totalSales,
      totalCustomers,
      recentOrders: recentOrders.map(o => ({ ...o, total: o.total / 100, user: o.customer }))
    });
  } catch (error) {
    console.error('API Error /api/dashboard/stats:', error);
    return NextResponse.json({ message: 'Failed to fetch stats' }, { status: 500 });
  }
}