/**
 * Turso Database Management Service
 * Creates new databases for each enterprise user/store
 */

import { z } from 'zod';

// Turso API configuration
const TURSO_API_BASE = 'https://api.turso.tech/v1';
const TURSO_ORG = process.env.TURSO_ORG;
const TURSO_API_TOKEN = process.env.TURSO_API_TOKEN;

// Validation schemas
const CreateStoreSchema = z.object({
  storeName: z.string().min(2).max(50).regex(/^[a-zA-Z0-9-_]+$/),
  ownerEmail: z.string().email(),
  ownerName: z.string().min(2).max(100),
});

export interface StoreDatabase {
  name: string;
  hostname: string;
  url: string;
  authToken: string;
  regions: string[];
}

export class TursoDatabaseService {
  
  /**
   * Create a new Turso database for a store
   */
  static async createStoreDatabase(storeData: z.infer<typeof CreateStoreSchema>): Promise<StoreDatabase> {
    try {
      // Validate input
      const validated = CreateStoreSchema.parse(storeData);
      
      // Generate unique database name
      const dbName = `store-${validated.storeName.toLowerCase()}-${Date.now()}`;
      
      console.log(`🏗️ Creating Turso database: ${dbName}`);
      
      // Create database via Turso API
      const createResponse = await fetch(`${TURSO_API_BASE}/organizations/${TURSO_ORG}/databases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: dbName,
          group: 'default',
          seed: {
            type: 'dump',
            name: 'base-store-schema',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!createResponse.ok) {
        const error = await createResponse.text();
        throw new Error(`Failed to create database: ${error}`);
      }

      const database = await createResponse.json();
      
      // Create database auth token
      const tokenResponse = await fetch(`${TURSO_API_BASE}/organizations/${TURSO_ORG}/databases/${dbName}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissions: {
            read_attach: {
              databases: [dbName]
            }
          }
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to create database auth token');
      }

      const tokenData = await tokenResponse.json();
      
      // Populate with initial data
      await this.populateStoreDatabase(database.hostname, tokenData.jwt);
      
      console.log(`✅ Store database created: ${dbName}`);
      
      return {
        name: dbName,
        hostname: database.hostname,
        url: `libsql://${database.hostname}`,
        authToken: tokenData.jwt,
        regions: database.regions || ['primary']
      };
      
    } catch (error) {
      console.error('❌ Failed to create store database:', error);
      throw error;
    }
  }

  /**
   * Populate a new store database with initial schema and data
   */
  static async populateStoreDatabase(hostname: string, authToken: string): Promise<void> {
    try {
      console.log('📦 Populating store database with initial data...');
      
      // Read the base schema
      const schemaSQL = await import('fs').then(fs => 
        fs.readFileSync('/Users/hayyaanshakeel/Desktop/jsevenour/schema.sql', 'utf8')
      );
      
      // Execute schema creation
      const { createClient } = await import('@libsql/client');
      const client = createClient({
        url: `libsql://${hostname}`,
        authToken: authToken,
      });
      
      // Split schema into individual statements
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await client.execute(statement);
        }
      }
      
      // Add initial categories
      const initialCategories = [
        { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
        { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
        { name: 'Books', slug: 'books', description: 'Books and educational materials' },
        { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear' }
      ];
      
      for (const category of initialCategories) {
        await client.execute({
          sql: 'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
          args: [category.name, category.slug, category.description]
        });
      }
      
      // Add sample products
      const sampleProducts = [
        {
          name: 'Sample Product 1',
          description: 'This is a sample product to get you started',
          price: '29.99',
          categoryId: 1,
          sku: 'SAMPLE-001',
          stock: 100,
          isActive: true
        },
        {
          name: 'Sample Product 2', 
          description: 'Another sample product for your store',
          price: '49.99',
          categoryId: 2,
          sku: 'SAMPLE-002',
          stock: 50,
          isActive: true
        }
      ];
      
      for (const product of sampleProducts) {
        await client.execute({
          sql: 'INSERT INTO products (name, description, price, categoryId, sku, stock, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [product.name, product.description, product.price, product.categoryId, product.sku, product.stock, product.isActive]
        });
      }
      
      await client.close();
      console.log('✅ Store database populated successfully');
      
    } catch (error) {
      console.error('❌ Failed to populate store database:', error);
      throw error;
    }
  }

  /**
   * Get database connection details for a store
   */
  static async getStoreDatabase(storeName: string): Promise<StoreDatabase | null> {
    try {
      const response = await fetch(`${TURSO_API_BASE}/organizations/${TURSO_ORG}/databases`, {
        headers: {
          'Authorization': `Bearer ${TURSO_API_TOKEN}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch databases');
      }

      const data = await response.json();
      const database = data.databases.find((db: any) => 
        db.name.includes(storeName.toLowerCase())
      );

      if (!database) {
        return null;
      }

      return {
        name: database.name,
        hostname: database.hostname,
        url: `libsql://${database.hostname}`,
        authToken: '', // Would need to fetch separately
        regions: database.regions || ['primary']
      };
      
    } catch (error) {
      console.error('❌ Failed to get store database:', error);
      return null;
    }
  }
}

export default TursoDatabaseService;
