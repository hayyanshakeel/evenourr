import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { CollectionsService } from '@/lib/admin-data';

export async function GET(request: NextRequest) {
  try {
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const collections = await CollectionsService.getAll({ limit: 1000 });
    
    const csvHeader = 'ID,Title,Handle,Description,Product Count,Created\n';
    const csvData = collections.map(c => 
      `${c.id},"${c.title}","${c.handle}","${c.description || ''}",${c.productCount},${c.createdAt}`
    ).join('\n');
    
    const csv = csvHeader + csvData;
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="collections.csv"'
      }
    });
  } catch (error) {
    console.error('Failed to export collections:', error);
    return NextResponse.json({ error: 'Failed to export collections' }, { status: 500 });
  }
}