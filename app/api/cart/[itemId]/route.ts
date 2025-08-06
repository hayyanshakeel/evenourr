import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { quantity } = await request.json();
    const { itemId } = await params;
    const itemIdNum = parseInt(itemId);
    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }
    await prisma.cartItem.update({
      where: { id: itemIdNum },
      data: { quantity },
    });
    return NextResponse.json({ message: 'Item updated' });
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const itemIdNum = parseInt(itemId);
    await prisma.cartItem.delete({ where: { id: itemIdNum } });
    return NextResponse.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Failed to remove item:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}