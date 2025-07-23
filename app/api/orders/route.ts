import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema'; // Import the 'orders' table schema
import { desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const allOrders = await db.query.orders.findMany({
      // This is the fix: use the imported 'orders' table
      orderBy: [desc(orders.createdAt)],
      with: {
        customer: true,
      },
    });

    return NextResponse.json({ orders: allOrders });

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}