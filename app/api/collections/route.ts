import { db } from '@/lib/db';
import { collections } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

/**
 * @description Get all collections
 * @method GET
 */
export async function GET() {
  try {
    console.log('Fetching collections...');
    const allCollections = await db.select().from(collections);
    return NextResponse.json(allCollections, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch collections:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

/**
 * @description Create a new collection
 * @method POST
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, handle, description, imageUrl } = body;

    if (!title || !handle) {
      return NextResponse.json(
        { error: 'Title and handle are required fields' },
        { status: 400 }
      );
    }

    const newCollection = await db
      .insert(collections)
      .values({
        title,
        handle,
        description,
        imageUrl,
      })
      .returning();

    return NextResponse.json(newCollection[0], { status: 201 });
  } catch (error: any) {
    console.error('Failed to create collection:', error);

    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed')
    ) {
      return NextResponse.json(
        { error: 'A collection with this handle already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create collection', detail: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}