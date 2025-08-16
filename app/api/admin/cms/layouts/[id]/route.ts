import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { CmsLayoutsService } from '@/lib/services/cms-layouts';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await CmsLayoutsService.getById(parseInt(id));
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const verification = await verifyFirebaseUser(request);
  if (!verification.user || verification.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: verification.status || 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const updated = await CmsLayoutsService.update(parseInt(id), body);
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const verification = await verifyFirebaseUser(request);
  if (!verification.user || verification.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: verification.status || 401 });
  }
  const { id } = await params;
  const removed = await CmsLayoutsService.remove(parseInt(id));
  return NextResponse.json(removed);
}


