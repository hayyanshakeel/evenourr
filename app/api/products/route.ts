import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Mock products data for now
    const mockProducts = [
      {
        id: 1,
        name: 'Sample Product 1',
        price: 29.99,
        inventory: 100,
        imageUrl: 'https://via.placeholder.com/150',
        status: 'active'
      },
      {
        id: 2,
        name: 'Sample Product 2',
        price: 49.99,
        inventory: 50,
        imageUrl: 'https://via.placeholder.com/150',
        status: 'active'
      },
      {
        id: 3,
        name: 'Sample Product 3',
        price: 19.99,
        inventory: 25,
        imageUrl: 'https://via.placeholder.com/150',
        status: 'active'
      }
    ];
    
    return NextResponse.json(mockProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock response for creating a product
    const newProduct = {
      id: Date.now(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
