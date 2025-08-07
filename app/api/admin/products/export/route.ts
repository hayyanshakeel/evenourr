import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { ProductsService } from '@/lib/admin-data';

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

    const { products } = await ProductsService.getAll({ limit: 1000 });
    
    const csvHeader = 'ID,Name,Price,Inventory,Status,Created\n';
    const csvData = products.map(p => 
      `${p.id},"${p.name}",${p.price},${p.inventory},${p.status},${p.createdAt}`
    ).join('\n');
    
    const csv = csvHeader + csvData;
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="products.csv"'
      }
    });
  } catch (error) {
    console.error('Failed to export products:', error);
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
  }
}