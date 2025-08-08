import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Simple role guard (replace with centralized auth propagation)
function ensureAdmin(req: NextRequest) {
  return req.headers.get('x-user-role') === 'admin';
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!ensureAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (name.length > 100) return NextResponse.json({ error: 'Name too long' }, { status: 400 });
    const category = await prisma.category.create({ data: { name } });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
