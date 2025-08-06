import { NextResponse } from 'next/server';

// Mock products data for batch requests
const mockProducts = [
  {
    id: 1,
    name: 'Sample Product 1',
    slug: 'sample-product-1',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Sample Product 2',
    slug: 'sample-product-2',
    imageUrl: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Sample Product 3',
    slug: 'sample-product-3',
    imageUrl: 'https://via.placeholder.com/150'
  }
];

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs must be a non-empty array' }, { status: 400 });
    }

    // Filter mock products by the requested IDs
    const productDetails = mockProducts.filter(product => ids.includes(product.id));

    return NextResponse.json(productDetails);
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}