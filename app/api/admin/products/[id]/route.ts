import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { ProductsService } from '@/lib/admin-data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const verification = await verifyFirebaseUser(request);
    if (!verification.user) {
      return NextResponse.json(
        { 
          error: verification.error || 'Unauthorized',
          details: 'Please ensure you are logged in and have a valid authentication token'
        },
        { status: verification.status || 401 }
      );
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const verification = await verifyFirebaseUser(request);
    if (!verification.user) {
      return NextResponse.json(
        { 
          error: verification.error || 'Unauthorized',
          details: 'Please ensure you are logged in and have a valid authentication token'
        },
        { status: verification.status || 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Update the product
    const product = await ProductsService.update(parseInt(id), {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      inventory: body.inventory ? parseInt(body.inventory) : undefined,
      status: body.status,
      imageUrl: body.imageUrl,
      categoryId: body.categoryId ? parseInt(body.categoryId) : undefined,
      collectionIds: body.collectionIds || [],
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const verification = await verifyFirebaseUser(request);
    if (!verification.user) {
      return NextResponse.json(
        { 
          error: verification.error || 'Unauthorized',
          details: 'Please ensure you are logged in and have a valid authentication token'
        },
        { status: verification.status || 401 }
      );
    }

    const { id } = await params;
    await ProductsService.delete(parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}