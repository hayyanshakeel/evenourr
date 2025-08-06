import { NextResponse } from 'next/server'
import { InventoryService } from '@/lib/admin-data'

export async function GET() {
  try {
    const alerts = await InventoryService.getLowStockAlerts()
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching inventory alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory alerts' }, { status: 500 })
  }
}
