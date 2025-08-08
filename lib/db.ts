import * as PrismaPkg from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

// Fallback extraction (some builds mis-report named export in editor tooling)
const PrismaClient = (PrismaPkg as any).PrismaClient as typeof import('@prisma/client').PrismaClient;

declare global { var __prisma: InstanceType<typeof PrismaClient> | undefined; }

let prismaInstance: InstanceType<typeof PrismaClient> | undefined;

function buildClient(): InstanceType<typeof PrismaClient> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  const forceLocal = process.env.FORCE_SQLITE_DEV === 'true';
  
  console.log('[db] buildClient config:', {
    adapter: !!url && !!token && !forceLocal ? 'turso' : 'sqlite',
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    hasUrl: !!url,
    hasToken: !!token,
    forceLocal
  });
  
  if (process.env.NODE_ENV === 'production') {
    if (!url || !token) throw new Error('Missing Turso env vars in production');
    return new PrismaClient({ adapter: new PrismaLibSQL({ url, authToken: token }) } as any);
  }
  if (url && token && !forceLocal) {
    return new PrismaClient({ adapter: new PrismaLibSQL({ url, authToken: token }) } as any);
  }
  return new PrismaClient();
}

function initPrisma(): InstanceType<typeof PrismaClient> {
  if (prismaInstance) return prismaInstance;
  prismaInstance = globalThis.__prisma ?? buildClient();
  if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prismaInstance;
  return prismaInstance;
}

export const prisma = initPrisma();
export function getPrisma() { return prisma; }

if (typeof process !== 'undefined') {
  ['SIGINT','SIGTERM'].forEach(sig => {
    process.once(sig as any, async () => { try { await prisma.$disconnect(); } finally { process.exit(0); } });
  });
}

export default prisma;
