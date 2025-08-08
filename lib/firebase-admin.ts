// Dynamic firebase-admin loader to avoid Edge runtime bundling
import type { Auth } from 'firebase-admin/auth';

let initializing: Promise<Auth> | null = null;
let adminAuth: Auth | null = null;

async function init(): Promise<Auth> {
  // If already initialized return cached auth
  if (adminAuth) return adminAuth;
  if (typeof (globalThis as any).EdgeRuntime === 'string') {
    throw new Error('firebase-admin not supported in Edge runtime');
  }
  if (!initializing) {
    initializing = (async () => {
      const appMod = await import('firebase-admin/app');
      const authMod = await import('firebase-admin/auth');
      const { getApps, initializeApp, cert } = appMod;

      if (!getApps().length) {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
        const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
        if (!projectId || !clientEmail || !privateKeyRaw) {
          throw new Error('Missing firebase-admin env vars');
        }
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
          }),
        });
      }
      adminAuth = authMod.getAuth();
      return adminAuth;
    })();
  }
  return initializing;
}

export async function getFirebaseAdminAuth(): Promise<Auth> {
  return init();
}
