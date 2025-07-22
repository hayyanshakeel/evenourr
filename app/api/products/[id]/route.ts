import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { products, productVariants, orderItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/products/[id] - Fetch a single product by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Fetch product
    const productResult = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (productResult.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productResult[0];

    // Fetch product variants
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));

    return NextResponse.json({
      ...product,
      variants
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[id] - Update a product
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product
    const updatedFields: any = {
      updatedAt: new Date().toISOString()
    };

    // Only update provided fields
    const allowedFields = [
      'title', 'description', 'price', 'compareAtPrice', 'cost',
      'imageUrl', 'images', 'inventory', 'sku', 'barcode',
      'weight', 'weightUnit', 'status', 'categoryId', 'vendor',
      'tags', 'seoTitle', 'seoDescription'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'images' || field === 'tags') {
          updatedFields[field] = JSON.stringify(body[field]);
        } else {
          updatedFields[field] = body[field];
        }
      }
    }

    // Check if handle is being updated and ensure it's unique
    if (body.handle && body.handle !== existingProduct[0]!.handle) {
      const handleExists = await db
        .select()
        .from(products)
        .where(eq(products.handle, body.handle))
        .limit(1);

      if (handleExists.length > 0) {
        return NextResponse.json({ error: 'Product handle already exists' }, { status: 400 });
      }

      updatedFields.handle = body.handle;
    }

    const updatedProduct = await db
      .update(products)
      .set(updatedFields)
      .where(eq(products.id, productId))
      .returning();

    // Handle variants update if provided
    if (body.variants) {
      // Delete existing variants
      await db.delete(productVariants).where(eq(productVariants.productId, productId));

      // Insert new variants
      if (body.variants.length > 0) {
        const variantsData = body.variants.map((variant: any, index: number) => ({
          productId,
          title: variant.title,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          sku: variant.sku,
          barcode: variant.barcode,
          inventory: variant.inventory || 0,
          weight: variant.weight,
          imageUrl: variant.imageUrl,
          options: variant.options ? JSON.stringify(variant.options) : null,
          position: index + 1
        }));

        await db.insert(productVariants).values(variantsData);
      }
    }

    // Fetch updated variants
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));

    return NextResponse.json({
      ...updatedProduct[0],
      variants
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id] - Delete a product
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product has been ordered
    const productOrders = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.productId, productId))
      .limit(1);

    if (productOrders.length > 0) {
      // Instead of deleting, archive the product
      await db
        .update(products)
        .set({ 
          status: 'archived',
          updatedAt: new Date().toISOString()
        })
        .where(eq(products.id, productId));

      return NextResponse.json({ 
        message: 'Product has been archived (has order history)',
        status: 'archived'
      });
    }

    // Delete product variants first
    await db.delete(productVariants).where(eq(productVariants.productId, productId));

    // Delete product
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
