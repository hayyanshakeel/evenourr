import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalRevenueResult = await prisma.orders.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'paid' }
    });
    const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

    const totalSalesResult = await prisma.orders.aggregate({ _count: { id: true } });
    const totalSales = totalSalesResult._count.id || 0;

    const totalCustomersResult = await prisma.customers.aggregate({ _count: { id: true } });
    const totalCustomers = totalCustomersResult._count.id || 0;

    const recentOrders = await prisma.orders.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    });

    return NextResponse.json({
      totalRevenue,
      totalSales,
      totalCustomers,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch dashboard stats', detail: error }, { status: 500 });
  }
}