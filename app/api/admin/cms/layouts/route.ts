import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { CmsLayoutsService } from '@/lib/services/cms-layouts';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const verification = await verifyFirebaseUser(request);
  if (!verification.user || verification.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: verification.status || 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || undefined;
  if (slug) {
    const item = await CmsLayoutsService.getBySlug(slug);
    return NextResponse.json({ item });
  }
  const items = await CmsLayoutsService.list();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const verification = await verifyFirebaseUser(request);
  if (!verification.user || verification.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: verification.status || 401 });
  }
  const body = await request.json();
  const { name, slug, device, data, published } = body || {};
  if (!name || !slug || data === undefined) {
    return NextResponse.json({ error: 'Missing required fields: name, slug, data' }, { status: 400 });
  }
  const created = await CmsLayoutsService.create({ name, slug, device, data, published });
  return NextResponse.json(created, { status: 201 });
}


