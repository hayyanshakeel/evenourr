// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { orders, customers } from '@/lib/schema';
import { sum, count, eq, desc } from 'drizzle-orm';

// Create direct client for complete schema
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client, { schema: { orders, customers } });

export async function GET() {
  try {
    const totalRevenueResult = await db
      .select({ total: sum(orders.total) })
      .from(orders)
      .where(eq(orders.financialStatus, 'paid'));

    const totalCustomersResult = await db
      .select({ count: count(customers.id) })
      .from(customers);

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const totalSalesResult = await db
      .select({ count: count(orders.id) })
      .from(orders);

    const stats = {
      totalRevenue: parseFloat(totalRevenueResult[0]?.total || '0'),
      totalSales: totalSalesResult[0]?.count ?? 0,
      totalCustomers: totalCustomersResult[0]?.count ?? 0,
      recentOrders,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[DASHBOARD_STATS_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
