import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch all products.
 * @returns {Promise<NextResponse>} A JSON response containing all products.
 */
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to create a new product.
 * It ensures that the price is converted to a number before database insertion.
 * @param {NextRequest} req The incoming request object.
 * @returns {Promise<NextResponse>} A JSON response with the newly created product or an error message.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate and parse the price from the request body
    if (body.price === undefined || body.price === null) {
        return NextResponse.json({ message: 'Price is a required field.' }, { status: 400 });
    }

    const priceAsNumber = parseFloat(body.price);

    // Check if the conversion resulted in a valid number
    if (isNaN(priceAsNumber)) {
      return NextResponse.json({ message: 'Invalid price format. Price must be a number.' }, { status: 400 });
    }

    // Create the new product object with the numeric price
    const newProductData = {
      ...body,
      price: priceAsNumber // Use the parsed number
    };

    // Insert the new product into the database
    const [newProduct] = await db.insert(products).values(newProductData).returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    // Provide a generic error message to the client
    return NextResponse.json(
      { message: 'Something went wrong while creating the product.' },
      { status: 500 }
    );
  }
}
