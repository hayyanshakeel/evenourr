import { NextRequest, NextResponse } from 'next/server';
import { EVRRegistrationService } from '@/lib/evr-registration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔐 Enterprise user registration request received');
    
    // Register user with dedicated database
    const result = await EVRRegistrationService.registerUser(body);
    
    if (!result.success) {
      return NextResponse.json({
        error: result.error || 'Registration failed'
      }, { status: 400 });
    }
    
    console.log('✅ Enterprise user registered successfully');
    
    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Enterprise account created successfully with dedicated database',
    });
    
  } catch (error) {
    console.error('❌ Registration API error:', error);
    
    return NextResponse.json({
      error: 'Registration failed',
      success: false
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeName = searchParams.get('storeName');
  
  if (!storeName) {
    return NextResponse.json({ error: 'Store name required' }, { status: 400 });
  }
  
  try {
    const isAvailable = await EVRRegistrationService.isStoreNameAvailable(storeName);
    
    return NextResponse.json({
      available: isAvailable,
      storeName
    });
    
  } catch (error) {
    console.error('❌ Store name check failed:', error);
    
    return NextResponse.json({
      error: 'Failed to check store name availability'
    }, { status: 500 });
  }
}
