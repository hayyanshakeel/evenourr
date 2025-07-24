import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allCollections = await prisma.collection.findMany();
    return NextResponse.json(allCollections, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch collections', detail: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, handle, description, imageUrl } = body;

    if (!title || !handle) {
      return NextResponse.json({ error: 'Title and handle are required fields' }, { status: 400 });
    }

    const newCollection = await prisma.collection.create({
      data: {
        title,
        handle,
        description,
        imageUrl
      }
    });

    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    console.error('Failed to create collection:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'A collection with this handle already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}