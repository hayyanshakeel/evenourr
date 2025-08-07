import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { ProductsService } from '@/lib/admin-data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const product = await ProductsService.getById(parseInt(id));
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await ProductsService.delete(parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}