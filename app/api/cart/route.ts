import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple session-based cart (using cookies for demo)
async function getOrCreateSessionId(setCookie?: boolean): Promise<{ id: string; newlyCreated: boolean }> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;
  let newlyCreated = false;
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    newlyCreated = true;
  }
  return { id: sessionId, newlyCreated };
}

export async function GET(_req: NextRequest) {
  try {
    const { id: sessionId, newlyCreated } = await getOrCreateSessionId();
    const cart = await prisma.cart.findFirst({ 
      where: { sessionId },
      include: { cartItems: { include: { product: true } } }
    });
    if (!cart) {
      const resp = NextResponse.json({ items: [] });
      if (newlyCreated) {
        resp.cookies.set('session_id', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60,
        });
      }
      return resp;
    }
    const responseItems = cart.cartItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product
    }));
    const resp = NextResponse.json({ items: responseItems });
    if (newlyCreated) {
      resp.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
      });
    }
    return resp;
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id: sessionId } = await getOrCreateSessionId();
    const { productId, quantity = 1 } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    let cart = await prisma.cart.findFirst({ where: { sessionId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { sessionId } });
    }
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: parseInt(productId) }
    });
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { 
          cartId: cart.id, 
          productId: parseInt(productId), 
          quantity 
        }
      });
    }
    const response = NextResponse.json({ success: true, message: 'Item added to cart' });
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60
    });
    return response;
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}