// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productVariants } from '@/lib/db/schema';
import { z } from 'zod';
import { desc } from 'drizzle-orm';

const CreateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int(),
  status: z.enum(['active', 'draft', 'archived']),
  variants: z.array(z.object({
    title: z.string(),
    price: z.number().int(),
    inventory: z.number().int(),
    sku: z.string().optional(),
  })),
});

/**
 * GET /api/products - Fetch all products
 * This is the new function that will send the product list to your dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const allProducts = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
    });
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('[PRODUCTS_GET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST /api/products - Create a new product
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = CreateProductSchema.parse(body);

    const newProduct = await db.transaction(async (tx) => {
      const [createdProduct] = await tx.insert(products).values({
        name: parsedData.name,
        slug: parsedData.slug,
        description: parsedData.description,
        price: parsedData.price,
        status: parsedData.status,
      }).returning();

      if (!createdProduct) {
        throw new Error('Failed to create product.');
      }

      if (parsedData.variants.length > 0) {
        const variantsToInsert = parsedData.variants.map(variant => ({
          productId: createdProduct.id,
          title: variant.title,
          price: variant.price,
          inventory: variant.inventory,
          sku: variant.sku,
        }));
        await tx.insert(productVariants).values(variantsToInsert);
      }

      return createdProduct;
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error('[PRODUCTS_POST_ERROR]', err);
    return NextResponse.json({ error: 'Could not create product' }, { status: 500 });
  }
}