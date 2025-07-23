#!/bin/bash
# Turso Environment Setup Script

echo "Setting up Turso environment variables..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

# Check if required variables are set
if grep -q "TURSO_DATABASE_URL" .env; then
    echo "✅ TURSO_DATABASE_URL already exists in .env"
else
    echo "Please enter your Turso database URL:"
    read -r db_url
    echo "TURSO_DATABASE_URL=$db_url" >> .env
    echo "✅ Added TURSO_DATABASE_URL to .env"
fi

if grep -q "TURSO_AUTH_TOKEN" .env; then
    echo "✅ TURSO_AUTH_TOKEN already exists in .env"
else
    echo "Please enter your Turso auth token:"
    read -r auth_token
    echo "TURSO_AUTH_TOKEN=$auth_token" >> .env
    echo "✅ Added TURSO_AUTH_TOKEN to .env"
fi

echo ""
echo "Environment setup complete! Run 'pnpm drizzle:push' again."
