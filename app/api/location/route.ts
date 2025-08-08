import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get client IP from request headers
    const forwardedFor = process.env.NODE_ENV === 'development' 
      ? '8.8.8.8' // Use public IP in dev for testing
      : undefined;

    // First try with ipapi.co (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/json/`, {
      headers: forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch location from ipapi.co');
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'Failed to get location');
    }
    
    const locationData = {
      country: data.country_name,
      countryCode: data.country_code,
      region: '', // Don't expose region/state for privacy
      city: '', // Don't expose city for privacy  
      timezone: data.timezone,
      currency: data.currency,
      ip: data.ip
    };

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Error fetching location from ipapi.co:', error);
    
    // Fallback to default location (US)
    const fallbackLocation = {
      country: 'United States',
      countryCode: 'US',
      region: '',
      city: '',
      timezone: 'America/New_York',
      currency: 'USD',
      ip: '127.0.0.1'
    };

    return NextResponse.json(fallbackLocation);
  }
}
