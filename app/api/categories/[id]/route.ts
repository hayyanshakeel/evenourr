import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const category = await prisma.category.findUnique({
      where: { id: idNum }
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    if (!Number.isInteger(idNum)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    await prisma.category.delete({ where: { id: idNum } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idNum = Number(id);
    const { name } = await req.json();
    if (!name || typeof name !== 'string') return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!Number.isInteger(idNum)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    const category = await prisma.category.update({
      where: { id: idNum },
      data: { name: name.trim() },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}
