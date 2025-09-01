#!/bin/bash

# Deploy 3-Layered Admin API Gateway to Cloudflare Workers
# This script deploys all three layers in the correct order

set -e

echo "🚀 Deploying 3-Layered Admin API Gateway..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler is not installed. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run:"
    echo "wrangler login"
    exit 1
fi

echo "✅ Cloudflare authentication verified"

# Set secrets for Layer 2 (Authentication)
echo "🔑 Setting secrets for Layer 2 (Authentication)..."
cd /Users/hayyaanshakeel/Desktop/jsevenour/cloudflare-workers
echo "Admin@123!Secure" | wrangler secret put ADMIN_PASSWORD --config layer2-wrangler.toml

# Set secrets for Layer 3 (Business Logic)
echo "🔑 Setting secrets for Layer 3 (Business Logic)..."
echo "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTY2NzUzODgsImlkIjoiNjYyMjQ0YjktNGNjNi00NWVkLTgyNjItZmZiOGVlZTMwMjNlIiwicmlkIjoiNjQwOTNmZDYtNzZiOS00YzQ4LWEwN2ItNmM0ODYyNGRmMmVhIn0.p5lmobj8YAUeg0iamrgz817v2wJeTA5YxZ-reE5h98aTjlfJsNkrJ_iodou4PzpyQApcR5UBnIbP6rWHSc-qBg" | wrangler secret put TURSO_AUTH_TOKEN --config layer3-wrangler.toml

# Deploy Layer 3 first (Business Logic)
echo "📦 Deploying Layer 3: Business Logic & Database..."
wrangler deploy --config layer3-wrangler.toml
echo "✅ Layer 3 deployed successfully"

# Deploy Layer 2 (Authentication)
echo "📦 Deploying Layer 2: Authentication & Authorization..."
wrangler deploy --config layer2-wrangler.toml
echo "✅ Layer 2 deployed successfully"

# Deploy Layer 1 (DDoS Protection)
echo "📦 Deploying Layer 1: DDoS Protection & Rate Limiting..."
wrangler deploy --config layer1-wrangler.toml
echo "✅ Layer 1 deployed successfully"

echo ""
echo "🎉 All layers deployed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "├── Layer 1 (DDoS Protection): https://ddos-protection.evenour-in.workers.dev"
echo "├── Layer 2 (Authentication): https://evenour-auth-validator.evenour-in.workers.dev"  
echo "└── Layer 3 (Business Logic): https://admin-api-gateway.evenour-in.workers.dev"
echo ""
echo "🔧 Admin Panel Configuration:"
echo "Update your .env.local file with:"
echo "NEXT_PUBLIC_ADMIN_API_GATEWAY_URL=https://ddos-protection.evenour-in.workers.dev"
echo ""
echo "🧪 Test the deployment:"
echo "curl https://ddos-protection.evenour-in.workers.dev/health"
echo ""
echo "✨ Your admin panel now has 3-layer security protection!"
