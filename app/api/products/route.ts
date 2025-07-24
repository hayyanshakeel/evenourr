import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const limitNum = limit && !isNaN(Number(limit)) ? Number(limit) : 100;
    const offsetNum = offset && !isNaN(Number(offset)) ? Number(offset) : 0;

    let allProducts;
    if (status && ['draft', 'active', 'archived'].includes(status)) {
      allProducts = await prisma.products.findMany({
        where: { status },
        take: limitNum,
        skip: offsetNum
      });
    } else {
      allProducts = await prisma.products.findMany({
        take: limitNum,
        skip: offsetNum
      });
    }
    return NextResponse.json(allProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string, 10) || 0;
    const status = formData.get('status') as string;
    // For image upload, you may need to handle this differently with Prisma
    const imageUrl = formData.get('image') as string;

    if (!name || isNaN(price) || !imageUrl) {
      return NextResponse.json({ error: 'Name, a valid price, and image are required' }, { status: 400 });
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        price,
        inventory,
        status,
        imageUrl,
      }
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
