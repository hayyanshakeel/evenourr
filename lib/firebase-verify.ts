import { firebaseAdminAuth } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function verifyFirebaseUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const idToken = authHeader?.split('Bearer ')[1];

  if (!idToken) {
    return { error: 'Unauthorized', status: 401 };
  }

  let decodedToken;
  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    return { error: 'Invalid token', status: 401 };
  }

  // Find or create user in local DB
  let user = await prisma.user.findUnique({
    where: { email: decodedToken.email! }
  });

  if (!user) {
    // Determine role based on email and Firebase UID
    let role = 'user';
    if (decodedToken.email === 'admin@evenour.co' || 
        decodedToken.uid === 'Xzeo6SISCyQOI2vipWcdl9QlbV32') {
      role = 'admin';
    }

    user = await prisma.user.create({
      data: {
        email: decodedToken.email!,
        password: 'firebase_auth', // Placeholder since we use Firebase
        firstName: decodedToken.name?.split(' ')[0] || 'User',
        lastName: decodedToken.name?.split(' ')[1] || '',
        role: role,
        emailVerified: decodedToken.email_verified || false,
      }
    });
  }

  return { user };
}
