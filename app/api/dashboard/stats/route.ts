import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders, products } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';
import '@/lib/db/relations';

export async function GET() {
  try {
    const totalRevenue = await db
      .select({
        total: sql<number>`sum(${orders.totalPrice})`,
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

    // Fetch recent orders (without relations)
    const recentOrders = await db.query.orders.findMany({
      limit: 5,
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    // Fetch customers for recent orders
    const customerIds = recentOrders.map(order => order.customerId);
    const customersList = await db.query.customers.findMany({
      where: (customers, { inArray }) => inArray(customers.id, customerIds),
    });
    const customersById = Object.fromEntries(customersList.map(c => [c.id, c]));
    const recentOrdersWithCustomer = recentOrders.map(order => ({
      ...order,
      customer: customersById[order.customerId] || null,
    }));

    return NextResponse.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalSales: totalSales[0]?.count || 0,
      totalCustomers: totalCustomers[0]?.count || 0,
      recentOrders: recentOrdersWithCustomer,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch dashboard stats', detail: error }, { status: 500 });
  }
}