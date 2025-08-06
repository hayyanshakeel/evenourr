import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid collection ID' }, { status: 400 });
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        productsToCollections: {
          include: {
            product: true
          }
        }
      }
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid collection ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, handle, description, imageUrl } = body;

    if (!title || !handle) {
      return NextResponse.json({ error: 'Title and handle are required fields' }, { status: 400 });
    }

    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        title,
        handle,
        description,
        imageUrl
      }
    });

    return NextResponse.json(updatedCollection, { status: 200 });
  } catch (error: any) {
    console.error('Error updating collection:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'A collection with this handle already exists.' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid collection ID' }, { status: 400 });
    }

    await prisma.collection.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting collection:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
