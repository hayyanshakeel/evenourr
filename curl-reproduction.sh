#!/bin/bash

# cURL commands to reproduce "Failed to fetch returns" and "Failed to fetch stats" errors
# Note: Replace TOKEN_HERE with a valid Firebase JWT token

TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiN2JhZmIyZjEwY2FlMmIxZjA3ZjM4MTZjNTQyMmJlY2NhNWMyMjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWRtaW4gVXNlciIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ldmVub3VyLWF1dGgtYXBwIiwiYXVkIjoiZXZlbm91ci1hdXRoLWFwcCIsImF1dGhfdGltZSI6MTc1NDU4ODg5NywidXNlcl9pZCI6Img2R3d1M2dIZURjNm1WOHZpcHVLRWQ0NFd5aDIiLCJzdWIiOiJoNkd3dTNnSGVEYzZtVjh2aXB1S0VkNDRXeWgyIiwiaWF0IjoxNzU0NTg4ODk3LCJleHAiOjE3NTQ1OTI0OTcsImVtYWlsIjoiZXZlbm91ci5pbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZXZlbm91ci5pbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.kaNVxI5HvK3O-67lOMc_I-0dOZ9tCBvvgHU4BpsdItVO4jQX0DfDWWKDOu0Kou0GRA20v2FAE9HfW9CVwxTkSVBBApzlLqhSxz1x-lWKKejYyOwQlMPfb554_CCflL01LXUzSpkCbVk2xUmYP8z3JcLAVDxv3ZBNSnHyQggdnvhKUVIocJf3A348lPpl6pcKwg9mZLteKFhMl7u-cCjYsko215L-bejU3_H9HCONQqfVtsc0DD1Ai4otLcDbJWdrvgGonW_GNjluCpxsHkDfP2C2XjkrozImDw1HnicW7A7DgF94VE1-Ubtlm_Wef03hEc_9Xvk7B3fIU054U1DI5w"

echo "🔥 REPRODUCING API FAILURES"
echo "============================="

echo ""
echo "1️⃣ Testing Returns Endpoint (Failed to fetch returns)"
echo "------------------------------------------------------"
curl -i "http://localhost:3001/api/admin/returns" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

echo ""
echo ""
echo "2️⃣ Testing Returns Stats Endpoint (Failed to fetch stats)"  
echo "--------------------------------------------------------"
curl -i "http://localhost:3001/api/admin/returns/stats" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

echo ""
echo ""
echo "3️⃣ Testing Returns with Query Parameters"
echo "----------------------------------------"
curl -i "http://localhost:3001/api/admin/returns?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

echo ""
echo ""
echo "4️⃣ Testing Returns Stats with Date Filters"
echo "------------------------------------------"
curl -i "http://localhost:3001/api/admin/returns/stats?dateFrom=2025-01-01&dateTo=2025-12-31" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

echo ""
echo ""
echo "📊 EXPECTED RESULTS:"
echo "- Status Code: 500 Internal Server Error"
echo "- Error: SQLite error: no such table: main.ReturnRequest"
echo "- Root Cause: Missing database tables for returns functionality"
