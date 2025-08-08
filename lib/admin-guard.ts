import { NextRequest } from 'next/server';
import { verifyFirebaseUser } from './firebase-verify';
import { fail } from './api-error';

export interface AdminGuardResult {
  user?: any;
  response?: Response;
}

export async function requireAdmin(request: NextRequest): Promise<AdminGuardResult> {
  const result = await verifyFirebaseUser(request);
  if (!result.user) {
    return { response: fail(result.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN', result.error || 'Unauthorized', result.status || 401) };
  }
  if (result.user.role !== 'admin') {
    return { response: fail('FORBIDDEN', 'Admin access required', 403) };
  }
  return { user: result.user };
}
