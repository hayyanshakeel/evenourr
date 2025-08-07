import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const verification = await verifyFirebaseUser(request);
    
    if (!verification.user) {
      return NextResponse.json(
        { 
          error: verification.error || 'Unauthorized',
          details: 'Please ensure you are logged in and have a valid authentication token'
        },
        { status: verification.status || 401 }
      );
    }

    const { id } = await params;
    const idNum = parseInt(id);
    
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }
    
    const category = await prisma.category.findUnique({
      where: { id: idNum }
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const verification = await verifyFirebaseUser(request);
    
    if (!verification.user) {
      return NextResponse.json(
        { 
          error: verification.error || 'Unauthorized',
          details: 'Please ensure you are logged in and have a valid authentication token'
        },
        { status: verification.status || 401 }
      );
    }

    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    const { name } = body;
    
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    
    const category = await prisma.category.update({ 
      where: { id: idNum }, 
      data: { name: name.trim() } 
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const verification = await verifyFirebaseUser(request);
    
    if (!verification.user) {
      return NextResponse.json(
        { 
          error: verification.error || 'Unauthorized',
          details: 'Please ensure you are logged in and have a valid authentication token'
        },
        { status: verification.status || 401 }
      );
    }

    const { id } = await params;
    const idNum = parseInt(id);
    
    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }
    
    await prisma.category.delete({ where: { id: idNum } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
