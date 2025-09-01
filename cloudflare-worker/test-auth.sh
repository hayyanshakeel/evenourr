#!/bin/bash

# Cloudflare Workers Authentication Test Script
# Tests the complete authentication flow

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

WORKER_URL="https://evenour-auth.YOUR_SUBDOMAIN.workers.dev"

echo -e "${BLUE}🧪 Testing Cloudflare Workers Authentication${NC}"
echo "Worker URL: $WORKER_URL"
echo

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "$WORKER_URL")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Health check failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo

# Test 2: Invalid Login
echo -e "${YELLOW}Test 2: Invalid Login${NC}"
response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}' \
    "$WORKER_URL/auth/login")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | tail -n -1)

if [ "$http_code" = "401" ]; then
    echo -e "${GREEN}✅ Invalid login correctly rejected${NC}"
else
    echo -e "${RED}❌ Invalid login test failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo

# Test 3: Valid Login (requires manual input)
echo -e "${YELLOW}Test 3: Valid Login${NC}"
echo -e "${BLUE}Please enter admin credentials:${NC}"
read -p "Username: " username
read -s -p "Password: " password
echo

response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$username\",\"password\":\"$password\"}" \
    "$WORKER_URL/auth/login")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | tail -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Login successful${NC}"

    # Extract token for next test
    token=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

    if [ -n "$token" ]; then
        echo -e "${GREEN}✅ Token received${NC}"

        # Test 4: Token Validation
        echo -e "${YELLOW}Test 4: Token Validation${NC}"
        response=$(curl -s -w "\n%{http_code}" \
            -H "Authorization: Bearer $token" \
            "$WORKER_URL/auth/validate")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | tail -n -1)

        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✅ Token validation successful${NC}"
        else
            echo -e "${RED}❌ Token validation failed (HTTP $http_code)${NC}"
            echo "Response: $body"
        fi

        # Test 5: Logout
        echo -e "${YELLOW}Test 5: Logout${NC}"
        response=$(curl -s -w "\n%{http_code}" \
            -X POST \
            -H "Authorization: Bearer $token" \
            "$WORKER_URL/auth/logout")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | tail -n -1)

        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✅ Logout successful${NC}"
        else
            echo -e "${RED}❌ Logout failed (HTTP $http_code)${NC}"
            echo "Response: $body"
        fi

        # Test 6: Token Validation After Logout
        echo -e "${YELLOW}Test 6: Token Validation After Logout${NC}"
        response=$(curl -s -w "\n%{http_code}" \
            -H "Authorization: Bearer $token" \
            "$WORKER_URL/auth/validate")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | tail -n -1)

        if [ "$http_code" = "401" ]; then
            echo -e "${GREEN}✅ Token correctly invalidated after logout${NC}"
        else
            echo -e "${RED}❌ Token still valid after logout (HTTP $http_code)${NC}"
            echo "Response: $body"
        fi
    else
        echo -e "${RED}❌ No token in login response${NC}"
    fi
else
    echo -e "${RED}❌ Login failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo

# Test 7: Security Events
echo -e "${YELLOW}Test 7: Security Events${NC}"
response=$(curl -s -w "\n%{http_code}" "$WORKER_URL/security/events")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | tail -n -1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Security events endpoint accessible${NC}"
    echo "Events logged: $(echo "$body" | grep -o '"id":' | wc -l)"
else
    echo -e "${RED}❌ Security events endpoint failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo

echo -e "${BLUE}🎉 Authentication testing complete!${NC}"
echo -e "${YELLOW}Note: Update WORKER_URL in this script with your actual worker URL${NC}"
