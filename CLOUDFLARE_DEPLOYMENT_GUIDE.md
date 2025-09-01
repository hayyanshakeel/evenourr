# 🚀 Cloudflare Workers Authentication Setup Guide

## Overview
This guide will help you deploy the complete Cloudflare Workers authentication system for your Evenour admin panel.

## Prerequisites
- Cloudflare account with Workers enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- Node.js 18+ installed

## Step 1: Cloudflare Setup

### 1.1 Login to Cloudflare
```bash
wrangler login
```

### 1.2 Create KV Namespaces
```bash
# Create KV namespaces for authentication
wrangler kv:namespace create "AUTH_TOKENS"
wrangler kv:namespace create "SECURITY_EVENTS"
wrangler kv:namespace create "USER_SESSIONS"
```

Note the namespace IDs returned by these commands - you'll need them for the configuration.

### 1.3 Update wrangler.toml
Edit `cloudflare-worker/wrangler.toml` and replace the placeholder IDs with your actual KV namespace IDs:

```toml
[[kv_namespaces]]
binding = "AUTH_TOKENS"
id = "your-auth-tokens-namespace-id"
preview_id = "your-auth-tokens-preview-namespace-id"

[[kv_namespaces]]
binding = "SECURITY_EVENTS"
id = "your-security-events-namespace-id"
preview_id = "your-security-events-preview-namespace-id"

[[kv_namespaces]]
binding = "USER_SESSIONS"
id = "your-user-sessions-namespace-id"
preview_id = "your-user-sessions-preview-namespace-id"
```

## Step 2: Environment Configuration

### 2.1 Set Secrets
```bash
cd cloudflare-worker

# Set admin password
echo "YourSecurePassword123!" | wrangler secret put ADMIN_PASSWORD

# Set JWT secret (generate a secure random string)
openssl rand -base64 32 | wrangler secret put JWT_SECRET
```

### 2.2 Update Next.js Environment
Add to your `.env` file:
```env
# Cloudflare Workers Authentication
NEXT_PUBLIC_CF_WORKER_URL="https://your-worker-name.your-subdomain.workers.dev"
NEXT_PUBLIC_ADMIN_USERNAME="admin"
```

## Step 3: Deploy Worker

### 3.1 Deploy to Development
```bash
cd cloudflare-worker
wrangler publish --env development
```

### 3.2 Test the Worker
Visit your worker URL and test the endpoints:
- `GET /` - Health check
- `POST /auth/login` - Admin login
- `GET /auth/validate` - Token validation

### 3.3 Deploy to Production
```bash
wrangler publish --env production
```

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain Routes
Update `wrangler.toml` with your custom domain:
```toml
[[routes]]
pattern = "auth.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### 4.2 Update Environment
```env
NEXT_PUBLIC_CF_WORKER_URL="https://auth.yourdomain.com"
```

## Step 5: Testing

### 5.1 Test Admin Login
1. Start your Next.js app: `npm run dev`
2. Navigate to `/hatsadmin/login`
3. Login with admin credentials
4. Verify dashboard access

### 5.2 Test Authentication Flow
```bash
# Test login
curl -X POST https://your-worker-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'

# Test validation
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-worker-url/auth/validate
```

## Step 6: Security Features

### 6.1 Enable Cloudflare Zero Trust (Recommended)
1. Go to Cloudflare Dashboard → Zero Trust
2. Create an Access Application
3. Configure authentication policies
4. Update worker with Access Application AUD

### 6.2 Monitor Security Events
```bash
# View security events
curl https://your-worker-url/security/events
```

## Step 7: Production Checklist

- [ ] KV namespaces created and configured
- [ ] Secrets set (ADMIN_PASSWORD, JWT_SECRET)
- [ ] Worker deployed to production
- [ ] Custom domain configured (optional)
- [ ] Next.js environment variables updated
- [ ] Admin login tested successfully
- [ ] Token validation working
- [ ] Logout functionality tested

## Troubleshooting

### Common Issues

**1. "Cannot find name" errors**
- Ensure all TypeScript types are properly imported
- Check that `@cloudflare/workers-types` is installed

**2. Worker deployment fails**
- Verify KV namespace IDs are correct
- Check that secrets are set properly
- Ensure wrangler is authenticated

**3. Authentication not working**
- Verify NEXT_PUBLIC_CF_WORKER_URL is correct
- Check that admin credentials match worker secrets
- Ensure JWT_SECRET is set

**4. CORS errors**
- CORS is handled automatically by the worker
- Check browser console for specific errors

### Debug Commands

```bash
# Check worker logs
wrangler tail

# List KV namespaces
wrangler kv:namespace list

# Get KV values (for debugging)
wrangler kv:key list --binding AUTH_TOKENS
```

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │────│ Cloudflare Worker│────│     KV Store    │
│                 │    │                  │    │                 │
│ • Admin Login   │    │ • JWT Auth       │    │ • Auth Tokens   │
│ • Dashboard     │    │ • Token Validate │    │ • User Sessions │
│ • API Routes    │    │ • Security Events│    │ • Security Logs │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Edge Computing**: Global low-latency authentication
- **KV Storage**: Fast, distributed key-value storage
- **Security Monitoring**: Real-time security event logging
- **Zero Trust Ready**: Compatible with Cloudflare Access
- **Rate Limiting**: Built-in protection against abuse

## Performance Benefits

- **Global Edge Network**: Authentication served from 200+ locations
- **Sub-millisecond Latency**: Fast KV storage operations
- **Auto-scaling**: No server management required
- **99.9% Uptime SLA**: Enterprise-grade reliability

## Next Steps

1. **Monitor Usage**: Use Cloudflare Analytics to monitor worker usage
2. **Set up Alerts**: Configure alerts for security events
3. **Backup Strategy**: Implement KV backup strategy if needed
4. **CI/CD Integration**: Add worker deployment to your CI/CD pipeline

---

🎉 **Congratulations!** Your Cloudflare Workers authentication system is now live and ready for production use.
