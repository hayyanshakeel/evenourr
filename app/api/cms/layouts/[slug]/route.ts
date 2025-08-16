import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const layout = await prisma.cmsLayout.findFirst({ where: { slug, published: true } });
  if (!layout) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(layout);
}


