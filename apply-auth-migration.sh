#!/bin/bash

echo "Applying auth_credentials table migration to Turso database..."

# Read the migration SQL
MIGRATION_SQL=$(cat prisma/migrations/20250831205059_add_auth_credentials_table/migration.sql)

# Create a temporary SQL file
cat > temp_migration.sql << 'EOF'
-- CreateTable
CREATE TABLE "auth_credentials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" DATETIME,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "securityLevel" TEXT NOT NULL DEFAULT 'ENHANCED',
    "storeName" TEXT,
    "databaseUrl" TEXT,
    "databaseToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "auth_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_credentials_email_key" ON "auth_credentials"("email");

-- CreateIndex
CREATE INDEX "auth_credentials_userId_idx" ON "auth_credentials"("userId");

-- CreateIndex
CREATE INDEX "auth_credentials_email_idx" ON "auth_credentials"("email");
EOF

echo "Created temporary migration file. Please run the following SQL in your Turso database:"
echo "=================================================="
cat temp_migration.sql
echo "=================================================="

# Clean up
rm temp_migration.sql

echo "To apply this migration, use the libSQL CLI or your Turso dashboard to execute the SQL above."
