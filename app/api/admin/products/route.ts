import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { ProductsService } from '@/lib/admin-data';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    // Get real products from database
    const result_data = await ProductsService.getAll({
      status,
      search,
      categoryId,
      limit,
      offset
    });

    // Format response to match expected structure
    const response = {
      products: result_data.products,
      total: result_data.total,
      hasMore: (offset + limit) < result_data.total
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
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

    const body = await request.json();
    
    // Validate required fields
    const { name, slug, price, inventory, status } = body;
    
    if (!name || !slug || price === undefined || inventory === undefined || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, price, inventory, status' },
        { status: 400 }
      );
    }

    // Create the product
    const product = await ProductsService.create({
      name,
      slug,
      description: body.description,
      price: parseFloat(price),
      inventory: parseInt(inventory),
      status,
      imageUrl: body.imageUrl,
      categoryId: body.categoryId ? parseInt(body.categoryId) : undefined,
      collectionIds: body.collectionIds || [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
