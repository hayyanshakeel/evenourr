import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema'; // Corrected import
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const allOrders = await db.query.orders.findMany({
            with: {
                customer: true, // Assuming you have a 'customer' relation on your orders table
            },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        return NextResponse.json(allOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}