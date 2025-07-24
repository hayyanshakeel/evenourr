import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema'; // Corrected import
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch orders (without relations)
        const allOrders = await db.query.orders.findMany({
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        // Fetch customers for orders
        const customerIds = allOrders.map(order => order.customerId);
        const customersList = await db.query.customers.findMany({
            where: (customers, { inArray }) => inArray(customers.id, customerIds),
        });
        const customersById = Object.fromEntries(customersList.map(c => [c.id, c]));
        const allOrdersWithCustomer = allOrders.map(order => ({
            ...order,
            customer: customersById[order.customerId] || null,
        }));
        return NextResponse.json(allOrdersWithCustomer);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}