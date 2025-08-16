import { NextRequest, NextResponse } from 'next/server'
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { InventoryService } from '@/lib/admin-data'
import prisma from '@/lib/db'

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const warehouseIdParam = searchParams.get('warehouseId');
    const warehouseId = warehouseIdParam ? Number(warehouseIdParam) : undefined;
    const productIdParam = searchParams.get('productId');
    const productId = productIdParam ? Number(productIdParam) : undefined;
    
    let limit = 20;
    let offset = 0;
    
    try {
      const limitParam = searchParams.get('limit');
      if (limitParam) {
        limit = Math.max(1, Math.min(100, parseInt(limitParam)));
      }
      
      const offsetParam = searchParams.get('offset');
      if (offsetParam) {
        offset = Math.max(0, parseInt(offsetParam));
      }
    } catch {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    // Sanitize search parameter
    const sanitizedSearch = search?.replace(/[<>]/g, '').substring(0, 100);

    const inventory = await InventoryService.getAll({
      search: sanitizedSearch,
      limit,
      offset,
      warehouseId,
      productId
    });
    
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}

// Simple stock snapshot for a SKU per warehouse
export async function POST(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) return NextResponse.json({ error: 'Unauthorized' }, { status: result.status });
    const { user } = result; if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { productId, warehouseId, delta, reason } = body as { productId: number; warehouseId: number; delta: number; reason?: string };
    if (!productId || !warehouseId || !Number.isFinite(delta)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // ensure stock row
      let stock = await tx.stockItem.findFirst({ where: { productId, warehouseId } });
      if (!stock) {
        stock = await tx.stockItem.create({ data: { productId, warehouseId, qtyOnHand: 0, qtyReserved: 0, unitCost: 0 } });
      }
      const newQty = stock.qtyOnHand + Math.trunc(delta);
      const saved = await tx.stockItem.update({ where: { id: stock.id }, data: { qtyOnHand: newQty } });
      await tx.movement.create({
        data: {
          type: 'adjust', status: 'posted', reference: reason || 'manual-adjust',
          lines: { create: [{ productId, quantity: Math.trunc(delta), unitCost: stock.unitCost, reason: reason || 'manual' }] }
        }
      });
      return saved;
    });

    return NextResponse.json({ success: true, stock: updated });
  } catch (err) {
    console.error('Inventory adjust error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
