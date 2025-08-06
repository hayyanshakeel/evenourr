import { NextResponse } from 'next/server'
import { CollectionsService } from '@/lib/admin-data'

export async function GET() {
  try {
    const stats = await CollectionsService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching collections stats:', error)
    return NextResponse.json({ error: 'Failed to fetch collections stats' }, { status: 500 })
  }
}
