import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { ok, fail } from '@/lib/api-error';
import prisma from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.response) return guard.response;

  try {
    const categories = await prisma.category.findMany({ 
      orderBy: { name: 'asc' } 
    });
    
    return ok(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return fail('INTERNAL_ERROR', 'Failed to fetch categories', 500);
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.response) return guard.response;

  try {
    const body = await request.json();
    const { name } = body;
    
    if (!name || typeof name !== 'string') {
      return fail('VALIDATION_ERROR', 'Category name is required', 400);
    }

    const category = await prisma.category.create({ 
      data: { name: name.trim() } 
    });
    
    return ok(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return fail('INTERNAL_ERROR', 'Failed to create category', 500);
  }
}
