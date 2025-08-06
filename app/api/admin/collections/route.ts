import { NextResponse } from 'next/server'
import { CollectionsService } from '@/lib/admin-data'

export async function GET() {
  try {
    const collections = await CollectionsService.getAll()
    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}
