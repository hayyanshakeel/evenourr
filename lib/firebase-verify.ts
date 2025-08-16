import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getFirebaseAdminAuth } from './firebase-admin';

interface VerifyResult {
  error?: string;
  status?: number;
  user?: any;
  reasonCode?: string;
}

export async function verifyFirebaseUser(request: NextRequest): Promise<VerifyResult> {
  // Basic structured debug (only in dev)
  const debug = process.env.NODE_ENV !== 'production';
  function log(...args: any[]) {
    if (debug) console.log('[auth]', ...args);
  }

  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader) {
      log('missing authorization header');
      return { error: 'Unauthorized', status: 401, reasonCode: 'NO_HEADER' };
    }

    const idToken = authHeader.replace(/^Bearer /i, '').trim();
    if (!idToken) {
      log('empty bearer token');
      return { error: 'Unauthorized', status: 401, reasonCode: 'EMPTY_TOKEN' };
    }

    let decodedToken: any;
    try {
      const auth = await getFirebaseAdminAuth();
      if (!auth) {
        log('admin auth instance undefined');
        return { error: 'Invalid token', status: 401, reasonCode: 'NO_ADMIN_AUTH' };
      }
      decodedToken = await auth.verifyIdToken(idToken);
      log('token verified uid=', decodedToken.uid, 'email=', decodedToken.email);
    } catch (e: any) {
      log('verifyIdToken failed', e?.code, e?.message);
      return { error: 'Invalid token', status: 401, reasonCode: e?.code || 'VERIFY_FAILED' };
    }

    const userEmail = decodedToken.email;
    if (!userEmail) {
      log('decoded token missing email');
      return { error: 'Invalid token payload', status: 401, reasonCode: 'NO_EMAIL' };
    }

    const adminEmails = [
      ...(process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : []),
      ...(process.env.ADMIN_EMAILS?.split(',') || [])
    ].filter(Boolean);
    const adminUids = process.env.ADMIN_UIDS?.split(',') || [];
    const isAdmin = adminEmails.includes(userEmail) || adminUids.includes(decodedToken.uid);

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (!user) {
        log('provisioning user record for', userEmail, 'admin?', isAdmin);
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
      }
    } catch (dbError) {
      console.error('Database connection failed, creating fallback user:', dbError);
      // Create a fallback user object when database is unavailable
      user = {
        id: decodedToken.uid,
        email: userEmail,
        firstName: decodedToken.name?.split(' ')[0] || '',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        role: isAdmin ? 'admin' : 'user',
        password: 'firebase_auth',
        isActive: true,
        emailVerified: decodedToken.email_verified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return { user };
  } catch (error) {
    console.error('Authentication internal error:', error);
    return { error: 'Internal Server Error', status: 500, reasonCode: 'INTERNAL' };
  }
}
