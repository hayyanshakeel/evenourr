#!/bin/bash

echo "🔍 Testing admin panel fixes..."
echo ""

# Test admin data services
echo "1. Testing admin-data.ts compilation..."
npx tsc --noEmit --skipLibCheck lib/admin-data.ts 2>/dev/null && echo "✅ admin-data.ts compiles successfully" || echo "❌ admin-data.ts has compilation errors"

# Test API endpoints
echo ""
echo "2. Testing API endpoints..."
sleep 2  # Give server time to be ready

# Test products API
PRODUCTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/admin/products)
if [ "$PRODUCTS_RESPONSE" = "200" ]; then
  echo "✅ Products API working (Status: $PRODUCTS_RESPONSE)"
else
  echo "❌ Products API failed (Status: $PRODUCTS_RESPONSE)"
fi

# Test products stats API
STATS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/admin/products/stats)
if [ "$STATS_RESPONSE" = "200" ]; then
  echo "✅ Products Stats API working (Status: $STATS_RESPONSE)"
else
  echo "❌ Products Stats API failed (Status: $STATS_RESPONSE)"
fi

# Test inventory API
INVENTORY_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/admin/inventory)
if [ "$INVENTORY_RESPONSE" = "200" ]; then
  echo "✅ Inventory API working (Status: $INVENTORY_RESPONSE)"
else
  echo "❌ Inventory API failed (Status: $INVENTORY_RESPONSE)"
fi

# Test orders API
ORDERS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/admin/orders)
if [ "$ORDERS_RESPONSE" = "200" ]; then
  echo "✅ Orders API working (Status: $ORDERS_RESPONSE)"
else
  echo "❌ Orders API failed (Status: $ORDERS_RESPONSE)"
fi

# Check page exports
echo ""
echo "3. Checking page exports..."
for page in app/hatsadmin/dashboard/*/page.tsx; do
  if grep -q "export default" "$page"; then
    echo "✅ $(basename $(dirname $page)) page has default export"
  else
    echo "❌ $(basename $(dirname $page)) page missing default export"
  fi
done

echo ""
echo "🎉 Admin panel bug fix testing complete!"
echo ""
echo "🌐 Access your admin panel at: http://localhost:3001/hatsadmin/dashboard"
