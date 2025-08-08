import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: { params: Promise<{ itemId: string }> }) {
  try {
    const { quantity } = await request.json();
    const { itemId } = await context.params;
    const itemIdNum = Number(itemId);
    if (!Number.isInteger(itemIdNum)) {
      return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
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

export async function DELETE(_request: Request, context: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await context.params;
    const itemIdNum = Number(itemId);
    if (!Number.isInteger(itemIdNum)) {
      return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
    }
    await prisma.cartItem.delete({ where: { id: itemIdNum } });
    return NextResponse.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Failed to remove item:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}