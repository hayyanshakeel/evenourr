import { NextRequest, NextResponse } from 'next/server'
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { CollectionsService } from '@/lib/admin-data'

export async function GET(request: NextRequest) {
  try {
    // Verify Firebase token and get user
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { user } = result;

    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const stats = await CollectionsService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching collections stats:', error)
    return NextResponse.json({ error: 'Failed to fetch collections stats' }, { status: 500 })
  }
}
