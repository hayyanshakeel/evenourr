import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const currencyCookie = cookieStore.get('preferred-currency');
    
    if (currencyCookie) {
      return NextResponse.json({ currency: currencyCookie.value });
    }
    
    // If no cookie, the client should proceed with IP detection.
    return NextResponse.json({ currency: null });
  } catch (error) {
    console.error('Error fetching currency preference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { currency } = await request.json();

    if (!currency || typeof currency !== 'string' || currency.length > 10) {
      return NextResponse.json({ error: 'Invalid currency provided' }, { status: 400 });
    }

    // Create a response object to set the cookie on
    const response = NextResponse.json({ success: true, message: `Currency preference set to ${currency}` });

    // Set the preference in a secure, HttpOnly cookie
    response.cookies.set('preferred-currency', currency, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    console.error('Error setting currency preference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
