import { NextRequest, NextResponse } from 'next/server';
import { deleteZone, listZones } from '@/lib/shipping-zones-store';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Actually delete the zone from our store
    const wasDeleted = deleteZone(id);
    
    if (!wasDeleted) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id, message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipping zone:', error);
    return NextResponse.json({ error: 'Failed to delete zone' }, { status: 500 });
  }
}
