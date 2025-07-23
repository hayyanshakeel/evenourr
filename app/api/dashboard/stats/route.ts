import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders, products } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const totalRevenue = await db
      .select({
        total: sql<number>`sum(${orders.total})`,
      })
      .from(orders)
      .where(sql`${orders.status} = 'paid'`);

    const totalSales = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders);

    const totalCustomers = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(customers);
      
    const recentOrders = await db.query.orders.findMany({
        limit: 5,
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        with: {
            customer: true,
        },
    });

    return NextResponse.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalSales: totalSales[0]?.count || 0,
      totalCustomers: totalCustomers[0]?.count || 0,
      recentOrders,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}