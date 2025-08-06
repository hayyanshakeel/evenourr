import { NextResponse } from 'next/server'
import { InventoryService } from '@/lib/admin-data'

export async function GET() {
  try {
    const inventory = await InventoryService.getAll()
    return NextResponse.json(inventory)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}
