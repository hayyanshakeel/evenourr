import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const { quantity } = await request.json();
    const itemId = parseInt(params.itemId);
    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }
    await prisma.cartItems.update({
      where: { id: itemId },
      data: { quantity },
    });
    return NextResponse.json({ message: 'Item updated' });
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const itemId = parseInt(params.itemId);
    await prisma.cartItems.delete({ where: { id: itemId } });
    return NextResponse.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Failed to remove item:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
