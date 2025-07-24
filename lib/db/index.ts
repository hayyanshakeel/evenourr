// Re-export the Prisma client from the main db file
export { default as prisma } from '../db';

// Stub export for Drizzle ORM compatibility
// Note: This project primarily uses Prisma
export const db = null; // Placeholder - implement when Drizzle is fully configured
