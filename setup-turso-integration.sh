#!/bin/bash

# Turso Integration Setup Script
# This script sets up Turso database integration with proper package versions

echo "🚀 Setting up Turso database integration..."

# Check if environment variables are set
if [ -z "$TURSO_DATABASE_URL" ] || [ -z "$TURSO_AUTH_TOKEN" ]; then
    echo "❌ Missing Turso environment variables"
    echo "Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local"
    exit 1
fi

echo "✅ Environment variables found"

# Install compatible libSQL packages
echo "📦 Installing compatible libSQL packages..."
pnpm remove @libsql/client @prisma/adapter-libsql 2>/dev/null || true
pnpm add @libsql/client@0.5.6 @prisma/adapter-libsql@5.15.0

# Update lib/db.ts to use Turso
echo "🔧 Configuring database connection..."
cat > lib/db.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  // Use Turso with libSQL adapter
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(libsql);
  prisma = globalThis.prisma || new PrismaClient({ adapter });
  
  console.log('✅ Connected to Turso database');
} else {
  // Fallback to local SQLite
  console.warn('⚠️ Turso credentials not found, using local SQLite database');
  prisma = globalThis.prisma || new PrismaClient();
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma };
export default prisma;
EOF

# Push schema to Turso
echo "📤 Pushing schema to Turso database..."
npx prisma db push

# Test connection
echo "🧪 Testing Turso connection..."
if curl -s "http://localhost:3000/api/settings" > /dev/null 2>&1; then
    echo "✅ Turso integration successful!"
else
    echo "⚠️ Server not running. Start with: npm run dev"
fi

echo "🎉 Turso setup complete!"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Test APIs: curl http://localhost:3000/api/settings"
echo "3. Check server logs for 'Connected to Turso database' message"
