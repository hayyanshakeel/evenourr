import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { TAGS } from 'lib/constants';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { collection, product } = body;

    if (collection) {
      revalidateTag(TAGS.collections);
    }

    if (product) {
      revalidateTag(TAGS.products);
    }

    revalidateTag(TAGS.cart);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
