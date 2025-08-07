import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
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

    const categories = await prisma.category.findMany({ 
      orderBy: { name: 'asc' } 
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name } = body;
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required' }, 
        { status: 400 }
      );
    }

    const category = await prisma.category.create({ 
      data: { name: name.trim() } 
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' }, 
      { status: 500 }
    );
  }
}
