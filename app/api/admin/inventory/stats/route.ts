import { NextResponse } from 'next/server'
import { InventoryService } from '@/lib/admin-data'

export async function GET() {
  try {
    const stats = await InventoryService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching inventory stats:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory stats' }, { status: 500 })
  }
}
