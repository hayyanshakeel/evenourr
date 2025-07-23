import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carts, cartItems, products } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const MOCK_USER_ID = 1;

export async function GET() {
  try {
    const userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, MOCK_USER_ID),
      with: {
        cartItems: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!userCart) {
      return NextResponse.json({ items: [] });
    }

    // Remap to a cleaner structure for the client
    const clientCart = userCart.cartItems.map(item => ({
        ...item.product,
        quantity: item.quantity,
    }));

    return NextResponse.json(clientCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 });
    }

    let userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, MOCK_USER_ID),
    });

    if (!userCart) {
      const newCartResult = await db.insert(carts).values({ userId: MOCK_USER_ID }).returning();
      userCart = newCartResult[0];
    }
    
    if (!userCart) { throw new Error("Failed to create or find cart"); }

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        eq(cartItems.productId, productId)
      ),
    });

    if (existingItem) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.cartId, userCart.id) && eq(cartItems.productId, productId));
    } else {
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId,
        quantity,
      });
    }

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}