#!/bin/bash

echo "🔐 Testing Admin Authentication Flow"
echo "=================================="

# Test 1: Check if server is running
echo "1. Checking if development server is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/debug/auth | grep -q "200"; then
    echo "   ✅ Server is running on port 3000"
else
    echo "   ❌ Server not responding on port 3000"
    echo "   💡 Run: pnpm dev"
    exit 1
fi

# Test 2: Check Firebase config
echo ""
echo "2. Checking Firebase configuration..."
if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
    echo "   ✅ Firebase API key configured"
else
    echo "   ❌ Missing Firebase API key"
fi

# Test 3: Check Turso config  
echo ""
echo "3. Checking Turso configuration..."
if grep -q "TURSO_DATABASE_URL" .env.local; then
    echo "   ✅ Turso database configured"
else
    echo "   ❌ Missing Turso configuration"
fi

# Test 4: Check admin emails
echo ""
echo "4. Checking admin configuration..."
if grep -q "ADMIN_EMAILS" .env.local; then
    echo "   ✅ Admin emails configured"
    echo "   📧 Admin email: $(grep ADMIN_EMAILS .env.local | cut -d'=' -f2 | tr -d '"')"
else
    echo "   ❌ Missing admin emails configuration"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Open: http://localhost:3000/hatsadmin/login"
echo "2. Login with: admin@evenour.co / Hayyaan123@1"
echo "3. Check authentication status in the top-right corner"
echo "4. If still failing, check browser console for detailed errors"
