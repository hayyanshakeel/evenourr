// Central environment validation

const REQUIRED_SERVER_ENV = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY'
];

interface EnvStatus {
  ok: boolean;
  missing: string[];
}

export function validateEnv(): EnvStatus {
  const missing = REQUIRED_SERVER_ENV.filter(k => !process.env[k] || process.env[k]?.trim() === '');
  return { ok: missing.length === 0, missing };
}

const status = validateEnv();
if (process.env.NODE_ENV === 'production' && !status.ok) {
  // Fail fast in production
  throw new Error('Missing required env vars: ' + status.missing.join(', '));
}

export const ENV = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
});
