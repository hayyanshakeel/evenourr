import { db } from '@/lib/db';
// This is the line that fixes the errors
import { products, productOptions, productVariants } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Updated GET function with better error logging
export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        options: true,
        variants: true
      },
      orderBy: (products, { desc }) => [desc(products.createdAt)]
    });
    return NextResponse.json(allProducts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching products from database:', {
      error,
      errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { message: 'Failed to fetch products.', error: errorMessage },
      { status: 500 }
    );
  }
}

// Updated POST function
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, options, variants } = body;

    if (!product || !product.name || !product.slug) {
      return NextResponse.json({ message: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = await db.transaction(async (tx) => {
      const [insertedProduct] = await tx
        .insert(products)
        .values({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: variants[0]?.price ? Math.round(parseFloat(variants[0].price) * 100) : 0,
          status: product.status,
          imageUrl: product.imageUrl
        })
        .returning();

      if (!insertedProduct) {
        throw new Error('Failed to create product.');
      }

      const productId = insertedProduct.id;

      if (options && options.length > 0) {
        await tx.insert(productOptions).values(
          options.map((opt: { name: string }) => ({
            productId: productId,
            name: opt.name
          }))
        );
      }

      if (variants && variants.length > 0) {
        await tx.insert(productVariants).values(
          variants.map((variant: any) => ({
            productId: productId,
            title: variant.title,
            price: variant.price ? Math.round(parseFloat(variant.price) * 100) : 0,
            inventory: variant.inventory ? parseInt(variant.inventory, 10) : 0,
            sku: variant.sku
          }))
        );
      }

      return insertedProduct;
    });

    revalidatePath('/');
    revalidatePath('/product');

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('DATABASE INSERT FAILED:', {
      error,
      errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { message: 'Database operation failed.', error: errorMessage },
      { status: 500 }
    );
  }
}