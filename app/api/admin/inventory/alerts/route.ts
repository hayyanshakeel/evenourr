import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const rows = await prisma.stockItem.findMany({
      where: { qtyOnHand: { gt: 0, lte: 10 } },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { qtyOnHand: 'asc' },
      take: 20,
    })
    const alerts = rows.map(r => ({ name: r.product.name, sku: r.product.slug, quantity: r.qtyOnHand }))
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching inventory alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory alerts' }, { status: 500 })
  }
}
