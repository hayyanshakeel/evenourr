import { NextRequest, NextResponse } from 'next/server';
import { requireEVRAdmin } from '@/lib/enterprise-auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const verification = await requireEVRAdmin(request);
    if ('error' in verification) {
      return NextResponse.json({ error: verification.error || 'Unauthorized' }, { status: 401 });
    }
    const { user } = verification;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Simulate inventory statistics
    const stats = {
      totalItems: 3,
      totalValue: 4748.45,
      lowStockItems: 1,
      outOfStockItems: 1,
      categories: [
        { name: 'Electronics', count: 1, value: 4498.50 },
        { name: 'Accessories', count: 2, value: 249.95 }
      ],
      recentMovements: [
        {
          id: 1,
          type: 'stock_in',
          productName: 'Sample Product 1',
          quantity: 50,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin'
        },
        {
          id: 2,
          type: 'stock_out',
          productName: 'Sample Product 2',
          quantity: 15,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'System'
        }
      ],
      summary: {
        inStock: 2,
        lowStock: 1,
        outOfStock: 1,
        totalProducts: 3,
        averageValue: 1582.82
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Inventory stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory statistics' },
      { status: 500 }
    );
  }
}
