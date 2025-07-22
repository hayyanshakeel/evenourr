import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles PUT requests to update an existing product by its ID.
 * It ensures that if the price is updated, it's converted to a number.
 * @param {NextRequest} req The incoming request object.
 * @param {{ params: { id: string } }} context The route parameters, containing the product ID.
 * @returns {Promise<NextResponse>} A JSON response with the updated product or an error message.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    // Validate the product ID from the URL
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
    }

    const body = await req.json();
    const updateData = { ...body };

    // If the price is part of the update, validate and parse it
    if (updateData.price !== undefined && updateData.price !== null) {
      const priceAsNumber = parseFloat(updateData.price);

      if (isNaN(priceAsNumber)) {
        return NextResponse.json({ message: 'Invalid price format. Price must be a number.' }, { status: 400 });
      }
      // Replace the string price with the parsed number
      updateData.price = priceAsNumber;
    }

    // Update the product in the database
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    // Check if a product was actually updated
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Something went wrong while updating the product.' },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to remove a product by its ID.
 * @param {NextRequest} req The incoming request object.
 * @param {{ params: { id: string } }} context The route parameters, containing the product ID.
 * @returns {Promise<NextResponse>} A response with a 204 status code on success or an error message.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id:string } }) {
    try {
        const id = parseInt(params.id, 10);

        // Validate the product ID
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
        }

        // Delete the product and check if the operation was successful
        const result = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });

        if (result.length === 0) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
        }

        // Return a success response with no content
        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error(`Error deleting product ${params.id}:`, error);
        return NextResponse.json(
            { message: 'Something went wrong while deleting the product.' },
            { status: 500 }
        );
    }
}
