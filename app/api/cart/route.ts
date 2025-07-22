import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { carts, cartItems, products } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

// Define types for our cart and items for clarity
type Cart = typeof carts.$inferSelect;
type CartItem = typeof cartItems.$inferSelect;

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const cartIdCookie = cookieStore.get('cartId');
    let cart: Cart | undefined;

    // Check for an existing cart ID in cookies
    if (cartIdCookie) {
      const existingCart = await db
        .select()
        .from(carts)
        .where(eq(carts.id, parseInt(cartIdCookie.value)))
        .get();
      if (existingCart) {
        cart = existingCart;
      }
    }

    // If no valid cart exists, create a new one
    if (!cart) {
      cart = await db.insert(carts).values({}).returning().get();
      const items: CartItem[] = [];
      // Create response first, then set cookie
      const response = NextResponse.json({ cart, items });
      response.cookies.set('cartId', cart.id.toString(), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // One week
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      return response;
    }

    // If cart exists, fetch its items and return
    const items: CartItem[] = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id)).all();
    return NextResponse.json({ cart, items });

  } catch (error) {
    console.error('Failed to get cart:', error);
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const cartIdCookie = cookieStore.get('cartId');
    let cart: Cart | undefined;
    let wasCartCreated = false;

    // Check for an existing cart ID in cookies
    if (cartIdCookie) {
        const existingCart = await db
          .select()
          .from(carts)
          .where(eq(carts.id, parseInt(cartIdCookie.value)))
          .get();
        if (existingCart) {
          cart = existingCart;
        }
      }
  
    // If no valid cart exists, create a new one
    if (!cart) {
        cart = await db.insert(carts).values({}).returning().get();
        wasCartCreated = true;
    }

    const { productId, variantId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await db.select().from(products).where(eq(products.id, productId)).get();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if item already exists in cart to update quantity, otherwise create new
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)))
      .get();

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      await db.update(cartItems).set({ quantity: newQuantity }).where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        variantId,
        quantity,
        price: product.price // Use the current product price
      });
    }

    const items: CartItem[] = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id)).all();
    const response = NextResponse.json({ cart, items });

    // If we created a new cart in this request, set the cookie on the response
    if (wasCartCreated) {
        response.cookies.set('cartId', cart.id.toString(), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // One week
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });
    }
    
    return response;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
