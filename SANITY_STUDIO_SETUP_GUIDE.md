# Sanity Studio Setup Guide

## Current Status
Your Sanity Studio is now properly configured and accessible at `http://localhost:3000/studio`

## How to Access Your Studio

1. **Make sure your development server is running:**
   ```bash
   npm run dev
   ```

2. **Navigate to the studio:**
   - Open your browser and go to: `http://localhost:3000/studio`
   - You'll see the Sanity login screen

3. **Login to your studio:**
   - Choose your preferred authentication method:
     - Google
     - GitHub  
     - Email/password
   - Use the same credentials you used when creating your Sanity project

## Important Configuration

### Environment Variables
Make sure your `.env.local` file has the correct values:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Note:** Make sure there are no typos in your dataset name (it should be "production" not "prduction")

### Project Structure
Your Sanity Studio is set up with:
- **Location:** `/app/studio/`
- **Schemas:** Coupon and Homepage schemas in `/app/studio/schema/`
- **Configuration:** `/app/studio/sanity.config.ts`

## Troubleshooting

### If you see "Dataset not found" error:
1. Check your `.env.local` file for typos in the dataset name
2. Verify your project ID matches your Sanity project
3. Restart your development server after fixing environment variables

### If you see CORS errors:
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to Settings → API settings → CORS origins
4. Add these URLs:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://127.0.0.1:3000`

### If the studio doesn't load:
1. Clear your browser cache
2. Try in an incognito/private window
3. Check the browser console for specific errors

## Next Steps

Once logged in, you can:
1. Create and manage content using the schemas defined
2. Add more schemas as needed in `/app/studio/schema/`
3. Customize the studio interface through the configuration

## Creating New Schemas

To add new content types:
1. Create a new schema file in `/app/studio/schema/`
2. Export it from `/app/studio/schema/index.ts`
3. Restart your development server

Example schema structure:
```typescript
export default {
  name: 'yourSchemaName',
  title: 'Your Schema Title',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    }
    // Add more fields as needed
  ]
}
```

## Production Deployment

When deploying to production:
1. Add your production URL to Sanity CORS origins
2. Set environment variables in your hosting platform
3. The studio will be available at `https://yourdomain.com/studio`
