// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { z } from 'zod';

const CreateProductSchema = z.object({
  name:        z.string().min(1),
  description: z.string().optional(),
  price:       z.number().int().positive(),
  inventory:   z.number().int().min(0),
  imageUrl:    z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, inventory, imageUrl } =
      CreateProductSchema.parse(body);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const [newProduct] = await db
      .insert(products)
      .values({
        slug,
        name,
        description,
        price,
        inventory,
        imageUrl,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json(
      { error: 'Could not create product' },
      { status: 500 }
    );
  }
}