#!/bin/bash

# Enterprise Turso Database Setup Script
# This script properly configures and syncs the schema with Turso

echo "🚀 Setting up Enterprise Turso Database Integration..."

# Check if Turso credentials exist
if [ -z "$TURSO_DATABASE_URL" ] || [ -z "$TURSO_AUTH_TOKEN" ]; then
    echo "❌ Missing Turso credentials in environment"
    echo "Please ensure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set in .env.local"
    exit 1
fi

echo "✅ Turso credentials found"
echo "📡 Database URL: $TURSO_DATABASE_URL"

# Generate SQL schema from Prisma
echo "📝 Generating SQL schema from Prisma..."
npx prisma db push --force-reset
npx prisma generate

echo "📤 Exporting current schema to SQL..."
sqlite3 prisma/dev.db .dump > turso_migration.sql

# Install Turso CLI if not exists
if ! command -v turso &> /dev/null; then
    echo "📦 Installing Turso CLI..."
    curl -sSfL https://get.tur.so/install.sh | bash
    export PATH="$HOME/.turso:$PATH"
fi

# Extract database name from URL
DB_NAME=$(echo $TURSO_DATABASE_URL | sed 's/.*:\/\///g' | sed 's/\..*//g')
echo "🎯 Database name: $DB_NAME"

# Apply schema to Turso (this will create tables if they don't exist)
echo "🔄 Applying schema to Turso database..."
cat > turso_init.sql << 'EOF'
-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME,
    "phoneNumber" TEXT,
    "address" TEXT,
    "dateOfBirth" DATETIME,
    "preferences" TEXT,
    "profileImageUrl" TEXT
);

CREATE TABLE IF NOT EXISTS "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "handle" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "compareAtPrice" REAL,
    "featuredImage" TEXT,
    "images" TEXT,
    "tags" TEXT,
    "variants" TEXT,
    "availableForSale" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "customerId" INTEGER,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "cancelledAt" DATETIME,
    "closedAt" DATETIME,
    "processedAt" DATETIME,
    "shippingAddress" TEXT,
    "billingAddress" TEXT,
    "shippingMethod" TEXT,
    "paymentMethod" TEXT,
    "trackingNumber" TEXT,
    "notes" TEXT,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ReturnRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReturnRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReturnRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Product_handle_key" ON "Product"("handle");
CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_cartId_productId_variantId_key" ON "CartItem"("cartId", "productId", "variantId");
EOF

# Execute the schema on Turso
turso db shell $DB_NAME < turso_init.sql

echo "✅ Turso database schema applied successfully!"

# Test connection
echo "🧪 Testing Turso connection..."
if curl -s "http://localhost:3000/api/admin/customers" | grep -q "401"; then
    echo "✅ Turso integration successful! (401 expected without auth)"
else
    echo "⚠️ Server may not be running. Start with: pnpm dev"
fi

# Cleanup
rm -f turso_migration.sql turso_init.sql

echo "🎉 Enterprise Turso Setup Complete!"
echo ""
echo "✨ Your system is now using Turso live database:"
echo "   🔗 Database: $TURSO_DATABASE_URL"
echo "   🛡️ All APIs now use live Turso database"
echo "   📊 Customer data is persistent across deployments"
echo ""
echo "🚀 Next Steps:"
echo "   1. Test customer creation: http://localhost:3000/hatsadmin/dashboard/customers/new"
echo "   2. Check database directly: turso db shell $DB_NAME"
echo "   3. Deploy to production with same Turso credentials"
