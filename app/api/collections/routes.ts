// app/api/collections/route.ts

import { db } from '@/lib/db';
import { collections } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

/**
 * @description Get all collections
 * @method GET
 */
export async function GET() {
  try {
    const allCollections = await db.query.collections.findMany();
    return NextResponse.json(allCollections, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch collections:', error);
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
      return NextResponse.json({ error: 'Title and handle are required fields' }, { status: 400 });
    }

    const newCollection = await db
      .insert(collections)
      .values({
        title,
        handle,
        description,
        imageUrl
      })
      .returning();

    return NextResponse.json(newCollection[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create collection:', error);
    // Handle specific DB errors, e.g., unique constraint for 'handle'
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ error: 'A collection with this handle already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}