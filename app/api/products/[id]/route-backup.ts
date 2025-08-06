import { NextRequest, NextResponse } from 'next/server';

// Mock products data for individual product requests
const mockProducts = [
  {
    id: 1,
    name: 'Sample Product 1',
    slug: 'sample-product-1',
    price: 29.99,
    inventory: 100,
    imageUrl: 'https://via.placeholder.com/150',
    status: 'active',
    description: 'This is a sample product description for testing purposes.',
    category: 'Electronics',
    categoryId: 1,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    images: [
      { id: 1, url: 'https://via.placeholder.com/150', sortOrder: 1 }
    ]
  },
  {
    id: 2,
    name: 'Sample Product 2',
    slug: 'sample-product-2',
    price: 49.99,
    inventory: 50,
    imageUrl: 'https://via.placeholder.com/150',
    status: 'active',
    description: 'Another sample product for testing the application.',
    category: 'Clothing',
    categoryId: 2,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    images: [
      { id: 2, url: 'https://via.placeholder.com/150', sortOrder: 1 }
    ]
  },
  {
    id: 3,
    name: 'Sample Product 3',
    slug: 'sample-product-3',
    price: 19.99,
    inventory: 25,
    imageUrl: 'https://via.placeholder.com/150',
    status: 'active',
    description: 'Third sample product for comprehensive testing.',
    category: 'Books',
    categoryId: 3,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
    images: [
      { id: 3, url: 'https://via.placeholder.com/150', sortOrder: 1 }
    ]
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('PATCH request body:', body);

    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update the mock product
    const updateData: any = { ...body };
    if (updateData.quantity !== undefined) {
      updateData.inventory = updateData.quantity;
      delete updateData.quantity;
    }

    // Update the product in the mock array
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: mockProducts[productIndex]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('PUT request body:', body);

    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Full update of the mock product
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...body,
      id, // Ensure ID stays the same
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: mockProducts[productIndex]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Remove the product from mock array
    mockProducts.splice(productIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
