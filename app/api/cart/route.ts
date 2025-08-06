import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple session-based cart (using cookies for demo)
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;
  
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
  }
  
  return sessionId;
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = await getSessionId();
    
    const cart = await prisma.cart.findFirst({ 
      where: { sessionId: sessionId },
      include: {
        cartItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    const responseItems = cart.cartItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product
    }));

    return NextResponse.json({ items: responseItems });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    let cart = await prisma.cart.findFirst({ where: { sessionId: sessionId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { sessionId: sessionId } });
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
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}