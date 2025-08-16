import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyFirebaseUser } from '@/lib/firebase-verify'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request)
    if ('error' in result) return NextResponse.json({ error: 'Unauthorized' }, { status: result.status })
    const { user } = result; if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    let warehouses = await prisma.warehouse.findMany({ orderBy: { id: 'asc' } })
    if (warehouses.length === 0) {
      const created = await prisma.warehouse.create({ data: { code: 'MAIN', name: 'Main Warehouse', active: true } })
      warehouses = [created]
    }
    return NextResponse.json(warehouses)
  } catch (err) {
    console.error('warehouses GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request)
    if ('error' in result) return NextResponse.json({ error: 'Unauthorized' }, { status: result.status })
    const { user } = result; if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { code, name, address } = body as { code: string; name: string; address?: string }
    if (!code || !name) return NextResponse.json({ error: 'code and name required' }, { status: 400 })
    const wh = await prisma.warehouse.create({ data: { code, name, address: address || null, active: true } })
    return NextResponse.json(wh, { status: 201 })
  } catch (err) {
    console.error('warehouses POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


