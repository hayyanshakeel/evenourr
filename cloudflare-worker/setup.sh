#!/bin/bash

# Evenour Cloudflare Authentication Setup Script
# This script sets up the complete Cloudflare Workers authentication system

set -e

echo "🚀 Setting up Evenour Cloudflare Authentication..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

# Login to Cloudflare (if not already)
echo -e "${BLUE}🔐 Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}Please log in to Cloudflare:${NC}"
    wrangler login
fi

# Change to worker directory
cd cloudflare-worker

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Create KV namespaces
echo -e "${BLUE}🗄️ Creating KV namespaces...${NC}"

echo "Creating AUTH_TOKENS namespace..."
AUTH_TOKENS_ID=$(wrangler kv:namespace create "AUTH_TOKENS" --preview | grep -o '"id": "[^"]*"' | cut -d'"' -f4)
AUTH_TOKENS_PREVIEW_ID=$(wrangler kv:namespace create "AUTH_TOKENS" --preview | grep -o '"id": "[^"]*"' | cut -d'"' -f4)

echo "Creating SECURITY_EVENTS namespace..."
SECURITY_EVENTS_ID=$(wrangler kv:namespace create "SECURITY_EVENTS" | grep -o '"id": "[^"]*"' | cut -d'"' -f4)
SECURITY_EVENTS_PREVIEW_ID=$(wrangler kv:namespace create "SECURITY_EVENTS" --preview | grep -o '"id": "[^"]*"' | cut -d'"' -f4)

echo "Creating USER_SESSIONS namespace..."
USER_SESSIONS_ID=$(wrangler kv:namespace create "USER_SESSIONS" | grep -o '"id": "[^"]*"' | cut -d'"' -f4)
USER_SESSIONS_PREVIEW_ID=$(wrangler kv:namespace create "USER_SESSIONS" --preview | grep -o '"id": "[^"]*"' | cut -d'"' -f4)

# Update wrangler.toml with actual KV IDs
echo -e "${BLUE}⚙️ Updating wrangler.toml with KV namespace IDs...${NC}"

# Create temporary wrangler.toml with real IDs
cat > wrangler.toml << EOF
name = "evenour-auth"
main = "worker.ts"
compatibility_date = "2024-09-01"
compatibility_flags = ["nodejs_compat"]

[env.production]

[env.development]

[[kv_namespaces]]
binding = "AUTH_TOKENS"
id = "${AUTH_TOKENS_ID}"
preview_id = "${AUTH_TOKENS_PREVIEW_ID}"

[[kv_namespaces]]
binding = "SECURITY_EVENTS"  
id = "${SECURITY_EVENTS_ID}"
preview_id = "${SECURITY_EVENTS_PREVIEW_ID}"

[[kv_namespaces]]
binding = "USER_SESSIONS"
id = "${USER_SESSIONS_ID}"
preview_id = "${USER_SESSIONS_PREVIEW_ID}"

[vars]
ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "evenour.in@gmail.com"

# Add your custom domain routes here
# [[routes]]
# pattern = "auth.evenour.in/*"
# zone_name = "evenour.in"
EOF

# Set secrets
echo -e "${BLUE}🔑 Setting up secrets...${NC}"
echo -e "${YELLOW}Please enter your admin password (or press Enter for default):${NC}"
read -s ADMIN_PASSWORD
if [ -z "$ADMIN_PASSWORD" ]; then
    ADMIN_PASSWORD="Admin@123!Secure"
fi

echo -e "${YELLOW}Please enter your JWT secret (or press Enter for auto-generated):${NC}"
read -s JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
fi

# Set secrets using wrangler
echo "$ADMIN_PASSWORD" | wrangler secret put ADMIN_PASSWORD
echo "$JWT_SECRET" | wrangler secret put JWT_SECRET

# Deploy to development
echo -e "${BLUE}🚀 Deploying to development environment...${NC}"
wrangler publish --env development

echo -e "${GREEN}✅ Cloudflare Workers authentication setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Setup Summary:${NC}"
echo -e "  • AUTH_TOKENS KV: ${AUTH_TOKENS_ID}"
echo -e "  • SECURITY_EVENTS KV: ${SECURITY_EVENTS_ID}"
echo -e "  • USER_SESSIONS KV: ${USER_SESSIONS_ID}"
echo -e "  • Admin Username: admin"
echo -e "  • Admin Email: evenour.in@gmail.com"
echo ""
echo -e "${YELLOW}🔗 Your worker is now deployed and accessible at:${NC}"
echo -e "  • Development: https://evenour-auth.YOUR_SUBDOMAIN.workers.dev"
echo ""
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "  1. Note your worker URL above"
echo "  2. Update your Next.js app to use this authentication endpoint"
echo "  3. Set up custom domain routes in wrangler.toml if needed"
echo "  4. Deploy to production with: wrangler publish --env production"
echo ""
echo -e "${GREEN}🎉 Authentication system is ready!${NC}"
