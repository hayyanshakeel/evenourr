import { NextRequest, NextResponse } from 'next/server'
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { InventoryService } from '@/lib/admin-data'

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    
    let limit = 20;
    let offset = 0;
    
    try {
      const limitParam = searchParams.get('limit');
      if (limitParam) {
        limit = Math.max(1, Math.min(100, parseInt(limitParam)));
      }
      
      const offsetParam = searchParams.get('offset');
      if (offsetParam) {
        offset = Math.max(0, parseInt(offsetParam));
      }
    } catch {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    // Sanitize search parameter
    const sanitizedSearch = search?.replace(/[<>]/g, '').substring(0, 100);

    const inventory = await InventoryService.getAll({
      search: sanitizedSearch,
      limit,
      offset
    });
    
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
