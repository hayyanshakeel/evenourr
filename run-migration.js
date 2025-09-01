const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Running enterprise auth schema migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', 'enterprise-auth-schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const cleanStmt = statement.trim();
      if (cleanStmt.toUpperCase().startsWith('BEGIN') || cleanStmt.toUpperCase().startsWith('COMMIT')) {
        continue; // Skip transaction commands for Prisma
      }
      
      if (cleanStmt.length > 0) {
        console.log('Executing:', cleanStmt.substring(0, 50) + '...');
        await prisma.$executeRawUnsafe(cleanStmt + ';');
      }
    }
    
    console.log('✅ Enterprise auth migration completed successfully!');
    console.log('📋 Created tables: auth_users, auth_devices, auth_sessions, auth_webauthn_challenges, auth_revoked_tokens, auth_audit_log');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
