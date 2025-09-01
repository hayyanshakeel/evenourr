import * as PrismaPkg from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

// Fallback extraction (some builds mis-report named export in editor tooling)
const PrismaClient = (PrismaPkg as any).PrismaClient as typeof import('@prisma/client').PrismaClient;

declare global { var __prisma: InstanceType<typeof PrismaClient> | undefined; }

let prismaInstance: InstanceType<typeof PrismaClient> | undefined;

function buildClient(): InstanceType<typeof PrismaClient> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  console.log('[db] buildClient config:', {
    adapter: 'turso',
    NODE_ENV: process.env.NODE_ENV,
    hasUrl: !!url,
    hasToken: !!token,
    tokenLength: token?.length,
    usingTurso: true,
  });

  // Always require Turso credentials - no local fallback
  if (!url || !token) {
    throw new Error('❌ Missing Turso credentials. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN. Local SQLite is disabled.');
  }

  try {
    console.log('🚀 Connecting to Turso database:', url);
    const client = new PrismaClient({
      adapter: new PrismaLibSQL({ url, authToken: token }),
      log: ['error', 'warn'],
    } as any);

    // Test the connection
    client.$connect()
      .then(() => {
        console.log('✅ Successfully connected to Turso database');
      })
      .catch((error) => {
        console.error('❌ Turso connection failed during connect:', error.message);
        console.warn('🔄 Will retry connection on next query...');
      });

    return client;
  } catch (error) {
    console.error('❌ Failed to create Turso client:', error);
    throw new Error('❌ Turso database connection failed');
  }
}

function initPrisma(): InstanceType<typeof PrismaClient> {
  if (prismaInstance) return prismaInstance;
  prismaInstance = globalThis.__prisma ?? buildClient();
  if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prismaInstance;
  return prismaInstance;
}

export const prisma = initPrisma();
export function getPrisma() { return prisma; }

// Enhanced error handling for database connection issues
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

if (typeof process !== 'undefined') {
  ['SIGINT','SIGTERM'].forEach(sig => {
    process.once(sig as any, async () => { 
      try { 
        await prisma.$disconnect(); 
        console.log('📤 Database disconnected gracefully');
      } finally { 
        process.exit(0); 
      } 
    });
  });
}

export default prisma;
