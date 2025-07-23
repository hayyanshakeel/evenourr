import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const allCustomers = await db.query.customers.findMany({
      orderBy: (customers, { desc }) => [desc(customers.createdAt)],
    });
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('API Error /api/customers:', error);
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}