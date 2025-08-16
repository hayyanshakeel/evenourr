import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();
    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Invalid HTML' }, { status: 400 });
    }
    // For now, just echo back. You could store this in object storage or convert to JSON blocks.
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}


