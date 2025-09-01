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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');

    // Simulate inventory data (since we don't have a full inventory system yet)
    const mockInventory = [
      {
        id: 1,
        productId: 'prod_001',
        productName: 'Sample Product 1',
        sku: 'SKU001',
        quantity: 150,
        lowStockThreshold: 20,
        unitPrice: 29.99,
        totalValue: 4498.50,
        warehouseId: warehouseId || 'warehouse_1',
        location: 'A-1-1',
        lastUpdated: new Date().toISOString(),
        status: 'in_stock'
      },
      {
        id: 2,
        productId: 'prod_002',
        productName: 'Sample Product 2',
        sku: 'SKU002',
        quantity: 5,
        lowStockThreshold: 10,
        unitPrice: 49.99,
        totalValue: 249.95,
        warehouseId: warehouseId || 'warehouse_1',
        location: 'A-1-2',
        lastUpdated: new Date().toISOString(),
        status: 'low_stock'
      },
      {
        id: 3,
        productId: 'prod_003',
        productName: 'Sample Product 3',
        sku: 'SKU003',
        quantity: 0,
        lowStockThreshold: 15,
        unitPrice: 19.99,
        totalValue: 0,
        warehouseId: warehouseId || 'warehouse_1',
        location: 'A-1-3',
        lastUpdated: new Date().toISOString(),
        status: 'out_of_stock'
      }
    ];

    // Filter by warehouse if specified
    const filteredInventory = warehouseId 
      ? mockInventory.filter(item => item.warehouseId === warehouseId)
      : mockInventory;

    return NextResponse.json({
      success: true,
      data: filteredInventory,
      meta: {
        total: filteredInventory.length,
        inStock: filteredInventory.filter(item => item.status === 'in_stock').length,
        lowStock: filteredInventory.filter(item => item.status === 'low_stock').length,
        outOfStock: filteredInventory.filter(item => item.status === 'out_of_stock').length,
      }
    });

  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
