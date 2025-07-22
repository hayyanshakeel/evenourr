# Turso Database Setup Guide

## Prerequisites
- Node.js 18+ installed
- Turso CLI installed (`npm install -g @turso/cli`)
- A Turso account (sign up at https://turso.tech)

## Step 1: Create Turso Database

```bash
# Login to Turso
turso auth login

# Create a new database
turso db create ecommerce-dashboard

# Get the database URL
turso db show ecommerce-dashboard --url

# Create an auth token
turso db tokens create ecommerce-dashboard
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## Step 3: Initialize Database Schema

```bash
# Install dependencies
npm install

# Push the schema to Turso
npm run drizzle:push
```

## Step 4: Verify Database Setup

```bash
# Start the development server
npm run dev

# In another terminal, run the test script
node test-apis.js
```

## Step 5: Seed Initial Data (Optional)

Create a `seed.js` file:

```javascript
import { db } from './lib/turso.js';
import { products, customers, coupons } from './lib/schema.js';

async function seed() {
  // Add sample products
  await db.insert(products).values([
    {
      handle: 'sample-tshirt',
      title: 'Sample T-Shirt',
      description: 'A comfortable cotton t-shirt',
      price: 2999,
      inventory: 100,
      status: 'active'
    },
    {
      handle: 'sample-jeans',
      title: 'Sample Jeans',
      description: 'Classic denim jeans',
      price: 7999,
      inventory: 50,
      status: 'active'
    }
  ]);

  // Add sample customer
  await db.insert(customers).values({
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    state: 'enabled'
  });

  // Add sample coupon
  await db.insert(coupons).values({
    code: 'WELCOME10',
    description: '10% off for new customers',
    discountType: 'percentage',
    discountValue: 10,
    status: 'active'
  });

  console.log('✅ Database seeded successfully');
}

seed().catch(console.error);
```

## Common Issues & Solutions

### Issue: "TURSO_DATABASE_URL is not defined"
**Solution**: Make sure your `.env.local` file exists and contains the correct environment variables.

### Issue: "Failed to connect to database"
**Solution**: 
1. Check your internet connection
2. Verify your database URL and auth token
3. Ensure your Turso database is active

### Issue: "Table not found" errors
**Solution**: Run `npm run drizzle:push` to create the tables in your database.

## Database Management Commands

```bash
# View current schema
turso db shell ecommerce-dashboard "SELECT name FROM sqlite_master WHERE type='table';"

# Export data
turso db export ecommerce-dashboard > backup.sql

# Import data
turso db shell ecommerce-dashboard < backup.sql
```

## Performance Tips

1. **Use Indexes**: The schema already includes primary keys, but add indexes for frequently queried fields
2. **Connection Pooling**: Turso handles this automatically
3. **Edge Locations**: Turso replicates your database to edge locations for low latency

## Monitoring

Monitor your database usage:
```bash
turso db show ecommerce-dashboard
```

## Next Steps

1. Set up authentication for your admin panel
2. Configure production environment variables
3. Set up automated backups
4. Implement proper logging and monitoring
5. Add API rate limiting

## Resources

- [Turso Documentation](https://docs.turso.tech)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js Documentation](https://nextjs.org/docs)
