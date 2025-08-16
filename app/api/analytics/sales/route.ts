import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '30d';
    
    // Realistic sales analytics data
    const totalSales = 8924.30 + Math.floor(Math.random() * 500) - 250;
    const previousSales = Math.round(totalSales * 0.85);
    const salesGrowth = ((totalSales - previousSales) / previousSales) * 100;
    const totalOrders = 108;
    const previousOrders = Math.round(totalOrders * 0.88);
    const avgOrderValue = totalSales / totalOrders;
    const previousAOV = previousSales / previousOrders;

    return NextResponse.json({
      summary: {
        totalSales: totalSales,
        previousSales: previousSales,
        salesGrowth: Math.round(salesGrowth * 10) / 10,
        totalOrders: totalOrders,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        conversionRate: 3.2,
        salesVolume: 142
      },
      metrics: {
        revenue: totalSales,
        previousRevenue: previousSales,
        orders: totalOrders,
        previousOrders: previousOrders,
        averageOrderValue: Math.round(avgOrderValue * 100) / 100,
        previousAOV: Math.round(previousAOV * 100) / 100,
        growthRate: Math.round(salesGrowth * 10) / 10,
        dailyGrowth: Math.round((salesGrowth / 30) * 10) / 10
      },
      salesByCategory: [
        { category: 'Electronics', sales: Math.round(totalSales * 0.45), percentage: 45 },
        { category: 'Accessories', sales: Math.round(totalSales * 0.28), percentage: 28 },
        { category: 'Apparel', sales: Math.round(totalSales * 0.18), percentage: 18 },
        { category: 'Home & Office', sales: Math.round(totalSales * 0.09), percentage: 9 }
      ],
      topPerformers: [
        { product: 'Wireless Headphones', sales: 2249.80, units: 15, growth: 24.5 },
        { product: 'Laptop Bag', sales: 1599.76, units: 20, growth: 18.2 },
        { product: 'Premium T-Shirt', sales: 899.70, units: 30, growth: 12.8 },
        { product: 'Desk Lamp', sales: 689.85, units: 15, growth: 8.4 }
      ],
      salesTrends: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const daySales = Math.floor(Math.random() * 400) + 150;
        return {
          date: date.toISOString().split('T')[0],
          sales: daySales,
          orders: Math.floor(daySales / 82.63),
          conversionRate: 2.8 + Math.random() * 1.2
        };
      }),
      timeframe: timeframe
    });

  } catch (error) {
    console.error('Sales analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
