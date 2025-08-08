import { NextRequest, NextResponse } from 'next/server';
import { listZones, createZone } from '@/lib/shipping-zones-store';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(listZones());
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const zone = createZone(body);
    return NextResponse.json(zone, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping zone:', error);
    return NextResponse.json({ error: 'Failed to create zone' }, { status: 500 });
  }
}
