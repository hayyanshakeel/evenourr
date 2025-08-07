import { firebaseAdminAuth } from './firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface VerifyResult {
  error?: string;
  status?: number;
  user?: any;
}

export async function verifyFirebaseUser(request: NextRequest): Promise<VerifyResult> {
  try {
    // Remove sensitive header logging in production
    if (process.env.NODE_ENV !== 'production') {
      const headers = Object.fromEntries(request.headers.entries());
      console.log('Request Headers:', headers);
    }
    
    // Check Authorization header with case-insensitive matching
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Authorization Header:', authHeader ? 'Present' : 'Missing');
    }
    
    const idToken = authHeader?.replace('Bearer ', '')?.trim();
    
    if (!idToken) {
      console.error('No token found in Authorization header');
      return { error: 'Unauthorized - No token provided', status: 401 };
    }

    // Remove token logging completely for security
    if (process.env.NODE_ENV !== 'production') {
      console.log('Token received: [REDACTED]');
    }

    let decodedToken;
    try {
      decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Token verified successfully for:', decodedToken.email);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return { error: 'Invalid token', status: 401 };
    }

    const userEmail = decodedToken.email;
    if (!userEmail) {
      console.error('No email in token payload');
      return { error: 'Invalid token payload', status: 401 };
    }

    // Check if user is admin - use environment variables for security
    const adminEmails = [
      ...(process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : []),
      ...(process.env.ADMIN_EMAILS?.split(',') || [])
    ].filter(Boolean);
    
    const adminUids = process.env.ADMIN_UIDS?.split(',') || [];
    
    // Remove debug logging in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Checking admin status for:', userEmail);
      console.log('Admin emails configured:', adminEmails.length);
      console.log('Admin UIDs configured:', adminUids.length);
    }
    
    const isAdmin = adminEmails.includes(userEmail) || adminUids.includes(decodedToken.uid);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Is admin:', isAdmin);
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Creating new user:', userEmail);
      }
      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName: decodedToken.name?.split(' ')[0] || '',
          lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
          role: isAdmin ? 'admin' : 'user',
          password: 'firebase_auth',
          isActive: true,
          emailVerified: decodedToken.email_verified || false,
        }
      });
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Found existing user:', userEmail);
      }
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Internal Server Error', status: 500 };
  }
}
