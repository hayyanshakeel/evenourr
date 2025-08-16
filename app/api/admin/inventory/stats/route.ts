import { NextRequest, NextResponse } from 'next/server'
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { InventoryService } from '@/lib/admin-data'
import prisma from '@/lib/db'

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    try {
      const [sumQty, lowStock, outOfStock] = await Promise.all([
        prisma.stockItem.aggregate({ _sum: { qtyOnHand: true } }),
        prisma.stockItem.count({ where: { qtyOnHand: { gt: 0, lte: 10 } } }),
        prisma.stockItem.count({ where: { qtyOnHand: 0 } }),
      ])
      const totalItems = sumQty._sum.qtyOnHand || 0
      return NextResponse.json({ totalItems, lowStock, outOfStock, totalValue: 0 }, { status: 200 })
    } catch (err) {
      console.error('Error fetching inventory stats:', err)
      // Safe defaults to keep UI stable
      return NextResponse.json({ totalItems: 0, lowStock: 0, outOfStock: 0, totalValue: 0 }, { status: 200 })
    }
  } catch (error) {
    console.error('Unexpected error in /api/admin/inventory/stats:', error)
    return NextResponse.json({ totalItems: 0, lowStock: 0, outOfStock: 0, totalValue: 0 }, { status: 200 })
  }
}
