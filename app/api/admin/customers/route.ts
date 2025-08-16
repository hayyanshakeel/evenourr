import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { customerService } from '@/lib/services/customer-service';

export const runtime = 'nodejs';

// Enterprise-grade error response
function createErrorResponse(message: string, status: number = 500, details?: any) {
  const response = {
    error: message,
    status,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };
  
  console.error(`[Customer API Error ${status}]:`, message, details);
  return NextResponse.json(response, { status });
}

// Enterprise-grade success response
function createSuccessResponse(data: any, status: number = 200) {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(response, { status });
}

export async function GET(request: NextRequest) {
  try {
    // Verify Firebase token and get user
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return createErrorResponse(result.error || 'Authentication failed', result.status);
    }

    const { user } = result;

    // Check if user has admin role
    if (user.role !== 'admin') {
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const sortBy = searchParams.get('sortBy') as 'name' | 'email' | 'createdAt' || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    // Validate query parameters
    if (limit < 1 || limit > 100) {
      return createErrorResponse('Limit must be between 1 and 100', 400);
    }
    
    if (offset < 0) {
      return createErrorResponse('Offset must be non-negative', 400);
    }

    // Get customers using enterprise service
    const result_data = await customerService.getCustomers({
      search,
      limit,
      offset,
      sortBy,
      sortOrder
    });

    return createSuccessResponse(result_data);

  } catch (error) {
    return createErrorResponse(
      'Failed to fetch customers',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [API] POST /api/admin/customers - Starting request');
    
    // Verify Firebase token and get user
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      console.log('❌ [API] Authentication failed:', result.error);
      return createErrorResponse(result.error || 'Authentication failed', result.status);
    }

    const { user } = result;
    console.log('✅ [API] User authenticated:', user.email, 'Role:', user.role);

    // Check if user has admin role
    if (user.role !== 'admin') {
      console.log('❌ [API] User not admin:', user.role);
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
      console.log('✅ [API] Request body parsed:', body);
    } catch (error) {
      console.log('❌ [API] Invalid JSON:', error);
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('❌ [API] Invalid content type:', contentType);
      return createErrorResponse('Content-Type must be application/json', 400);
    }

    console.log('🔧 [API] Calling customerService.createCustomer');
    // Create customer using enterprise service
    const customer = await customerService.createCustomer(body);
    console.log('✅ [API] Customer created successfully:', customer.id);

    return createSuccessResponse(customer, 201);

  } catch (error) {
    console.error('❌ [API] POST /api/admin/customers error:', error);
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Validation failed')) {
        return createErrorResponse(error.message, 400);
      }
      if (error.message.includes('already exists')) {
        return createErrorResponse(error.message, 409);
      }
      if (error.message.includes('not found')) {
        return createErrorResponse(error.message, 404);
      }
    }

    return createErrorResponse(
      'Failed to create customer',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
