# Sanity CORS Setup Guide

## The CORS Error
You're seeing: "Before you continue... To access your content, you need to add the following URL as a CORS origin to your Sanity project."

## Solution Steps

### 1. Clear Browser Cache
First, try clearing your browser cache or open the studio in an incognito/private window.

### 2. Verify CORS Settings in Sanity.io

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project (should match your NEXT_PUBLIC_SANITY_PROJECT_ID)
3. Go to **Settings** → **API settings** → **CORS origins**
4. Make sure you have added:
   - `http://localhost:3000` (without trailing slash)
   - `http://localhost:3000/studio` (sometimes needed)
   - `http://127.0.0.1:3000` (alternative localhost)

### 3. Add Additional Origins (if needed)
Sometimes you might need to add:
- `http://localhost:3001` (if port changes)
- Your production URL (e.g., `https://yourdomain.com`)

### 4. Check Token Permissions
In the same API settings:
1. Check if you have any tokens that might be restricting access
2. Ensure the dataset permissions are correct

### 5. Verify Environment Variables
Make sure your `.env.local` has the correct values:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 6. Hard Refresh
After adding CORS origins:
1. Wait 1-2 minutes for changes to propagate
2. Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Clear application data in DevTools:
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Storage → Clear site data

### 7. Test in Different Browser
Try accessing the studio in a different browser to rule out browser-specific issues.

## Common Issues

### Issue: CORS still showing after adding origins
**Solution**: The Sanity project ID in your environment variables might not match the project where you added CORS origins.

### Issue: Login works but still shows CORS error
**Solution**: This might be a different CORS issue related to API access. Check if you need to add credentials or tokens.

## Debugging Steps

1. Open browser DevTools Network tab
2. Look for failed requests to `api.sanity.io`
3. Check the response headers for CORS errors
4. Verify the Origin header matches what you added in Sanity

## Alternative Solution

If CORS issues persist, you can try adding the `cors` configuration to your Sanity config:

```typescript
// In app/studio/sanity.config.ts
export default defineConfig({
  // ... existing config
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
})
```

However, this is usually not necessary if CORS is properly configured in Sanity.io.
