#!/bin/bash

echo "🚀 Deploying 3-Layer Cloudflare Worker Security Architecture"
echo "============================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        exit 1
    fi
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
check_command wrangler
check_command node

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Deploy Layer 1: DDoS Protection
echo -e "\n${YELLOW}🛡️  Deploying Layer 1: DDoS Protection Worker...${NC}"
cd cloudflare-workers
wrangler deploy --config layer1-wrangler.toml
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Layer 1 deployed successfully${NC}"
else
    echo -e "${RED}❌ Layer 1 deployment failed${NC}"
    exit 1
fi

# Deploy Layer 2: Authentication 
echo -e "\n${YELLOW}🔐 Deploying Layer 2: Authentication Worker...${NC}"
wrangler deploy --config layer2-wrangler.toml
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Layer 2 deployed successfully${NC}"
else
    echo -e "${RED}❌ Layer 2 deployment failed${NC}"
    exit 1
fi

# Deploy Layer 3: Business Logic
echo -e "\n${YELLOW}📊 Deploying Layer 3: Business Logic Worker...${NC}"
wrangler deploy --config layer3-wrangler.toml
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Layer 3 deployed successfully${NC}"
else
    echo -e "${RED}❌ Layer 3 deployment failed${NC}"
    exit 1
fi

cd ..

echo -e "\n${GREEN}🎉 ALL LAYERS DEPLOYED SUCCESSFULLY!${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "🔗 ${YELLOW}Layer 1 (Entry Point):${NC} https://admin-ddos-protection.your-worker.workers.dev"
echo -e "🔗 ${YELLOW}Layer 2 (Authentication):${NC} https://admin-auth-validation.your-worker.workers.dev"  
echo -e "🔗 ${YELLOW}Layer 3 (Business Logic):${NC} https://admin-business-logic.your-worker.workers.dev"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Update your .env.local with the Layer 1 URL as CLOUDFLARE_AUTH_WORKER_URL"
echo "2. Test the admin panel navigation"
echo "3. Verify all APIs route through the 3-layer security system"
echo ""
echo -e "${GREEN}🏗️  3-Layer Security Architecture Active:${NC}"
echo "   Request → Layer 1 (DDoS) → Layer 2 (Auth) → Layer 3 (Business) → Response"
