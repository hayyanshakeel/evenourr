import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { customerService } from '@/lib/services/customer-service';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return createErrorResponse(result.error || 'Authentication failed', result.status);
    }

    const { user } = result;

    // Check if user has admin role
    if (user.role !== 'admin') {
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    const id = parseInt(paramId);
    if (isNaN(id) || id <= 0) {
      return createErrorResponse('Invalid customer ID format', 400);
    }

    const customer = await customerService.getCustomerById(id);
    if (!customer) {
      return createErrorResponse('Customer not found', 404);
    }

    return createSuccessResponse(customer);

  } catch (error) {
    return createErrorResponse(
      'Failed to fetch customer',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return createErrorResponse(result.error || 'Authentication failed', result.status);
    }

    const { user } = result;

    // Check if user has admin role
    if (user.role !== 'admin') {
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    const id = parseInt(paramId);
    if (isNaN(id) || id <= 0) {
      return createErrorResponse('Invalid customer ID format', 400);
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return createErrorResponse('Content-Type must be application/json', 400);
    }

    // Update customer using enterprise service
    const updatedCustomer = await customerService.updateCustomer(id, body);

    return createSuccessResponse(updatedCustomer);

  } catch (error) {
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
      'Failed to update customer',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return createErrorResponse(result.error || 'Authentication failed', result.status);
    }

    const { user } = result;

    // Check if user has admin role
    if (user.role !== 'admin') {
      return createErrorResponse('Forbidden - Admin access required', 403);
    }

    const id = parseInt(paramId);
    if (isNaN(id) || id <= 0) {
      return createErrorResponse('Invalid customer ID format', 400);
    }

    // Delete customer using enterprise service
    await customerService.deleteCustomer(id);

    return createSuccessResponse({ message: 'Customer deleted successfully' });

  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return createErrorResponse(error.message, 404);
      }
      if (error.message.includes('Cannot delete')) {
        return createErrorResponse(error.message, 409);
      }
    }

    return createErrorResponse(
      'Failed to delete customer',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
