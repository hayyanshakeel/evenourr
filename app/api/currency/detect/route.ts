import { NextRequest, NextResponse } from 'next/server';

// IP to country/currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'US': 'USD',
  'IN': 'INR', 
  'GB': 'GBP',
  'CA': 'CAD',
  'AU': 'AUD',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'JP': 'JPY',
  'CN': 'CNY',
  'KR': 'KRW',
  'SG': 'SGD',
  'BR': 'BRL',
  'MX': 'MXN',
  'RU': 'RUB',
  'TR': 'TRY',
  'ZA': 'ZAR',
  'NO': 'NOK',
  'SE': 'SEK',
  'DK': 'DKK',
  'PL': 'PLN',
  'CH': 'CHF'
};

async function getCountryFromIP(ip: string): Promise<string> {
  try {
    // Use a free IP geolocation service
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    const data = await response.json();
    return data.countryCode || 'US';
  } catch (error) {
    console.error('Error detecting country from IP:', error);
    return 'US'; // Default fallback
  }
}

function getClientIP(request: NextRequest): string {
  // Try different headers for IP detection
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0]?.trim() || '127.0.0.1';
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (clientIP) {
    return clientIP;
  }
  
  // Fallback - this might be localhost in development
  return '127.0.0.1';
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Don't detect for localhost/development
    if (clientIP === '127.0.0.1' || clientIP === '::1' || clientIP.includes('localhost')) {
      return NextResponse.json({
        success: true,
        currency: 'INR', // Default for development
        country: 'IN',
        detectedFromIP: false
      });
    }
    
    const country = await getCountryFromIP(clientIP);
    const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';
    
    return NextResponse.json({
      success: true,
      currency,
      country,
      detectedFromIP: true,
      ip: clientIP // For debugging, remove in production
    });
    
  } catch (error) {
    console.error('Error detecting currency:', error);
    return NextResponse.json({
      success: false,
      currency: 'USD', // Safe fallback
      country: 'US',
      detectedFromIP: false
    });
  }
}
