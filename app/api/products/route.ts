import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string, 10) || 0;
    const status = formData.get('status') as string;
    const imageFile = formData.get('image') as File;

    if (!name || isNaN(price) || !imageFile) {
      return NextResponse.json({ error: 'Name, a valid price, and image are required' }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
    }

    const newProduct = await db
      .insert(products)
      .values({
        name,
        price,
        inventory,
        status: status as 'draft' | 'active' | 'archived', // Correctly typed
        imageUrl,
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}