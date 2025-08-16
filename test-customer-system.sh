#!/bin/bash

# Enterprise Customer Management System Test Script
# This script tests the robustness of the customer creation and management system

echo "🚀 Testing Enterprise Customer Management System"
echo "=============================================="

# Test 1: Create a valid customer
echo "📝 Test 1: Creating a valid customer..."
curl -X POST http://localhost:3001/api/admin/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo ""

# Test 2: Try to create customer with invalid email
echo "📝 Test 2: Testing email validation..."
curl -X POST http://localhost:3001/api/admin/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "invalid-email",
    "phone": "+1234567890"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo ""

# Test 3: Try to create customer with missing required fields
echo "📝 Test 3: Testing required field validation..."
curl -X POST http://localhost:3001/api/admin/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "phone": "+1234567890"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo ""

# Test 4: Try to create duplicate customer
echo "📝 Test 4: Testing duplicate email validation..."
curl -X POST http://localhost:3001/api/admin/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone": "+1234567891"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo ""

# Test 5: Get customers list
echo "📝 Test 5: Fetching customers list..."
curl -X GET "http://localhost:3001/api/admin/customers?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo ""

# Test 6: Search customers
echo "📝 Test 6: Testing customer search..."
curl -X GET "http://localhost:3001/api/admin/customers?search=john&limit=5" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo ""

echo "✅ Enterprise Customer Management System Test Complete!"
echo "======================================================="
echo "🔍 Check the responses above to verify:"
echo "   - Customer creation works correctly"
echo "   - Validation prevents invalid data"
echo "   - Duplicate email detection works"
echo "   - Error responses are informative"
echo "   - Search functionality works"
echo ""
echo "💡 Note: Replace YOUR_FIREBASE_TOKEN with a valid admin token to run these tests"
