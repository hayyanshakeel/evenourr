// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, customers } from '@/lib/db/schema';
import { sum, count, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const totalRevenueResult = await db
      .select({ total: sum(orders.total) })
      .from(orders)
      .where(eq(orders.status, 'paid'));

    const totalCustomersResult = await db
      .select({ count: count(customers.id) })
      .from(customers);

    const recentOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      limit: 5,
      with: {
        user: {
          columns: { name: true },
        },
      },
    });

    const stats = {
      totalRevenue: parseFloat(totalRevenueResult[0]?.total || '0'),
      totalSales: recentOrders.length,
      totalCustomers: totalCustomersResult[0]?.count ?? 0,
      recentOrders,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[DASHBOARD_STATS_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}