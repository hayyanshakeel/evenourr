// app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, coupons, orders, customers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Get total products count
    const productsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.status, 'active'));

    // Get total coupons count
    const couponsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(coupons);

    // Get total orders count
    const ordersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    // Get total customers count
    const customersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.state, 'enabled'));

    return NextResponse.json({
      products: productsCount[0]?.count ?? 0,
      coupons: couponsCount[0]?.count ?? 0,
      orders: ordersCount[0]?.count ?? 0,
      customers: customersCount[0]?.count ?? 0,
    });
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}