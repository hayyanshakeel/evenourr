const { createClient } = require('@libsql/client');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function applySchemaToTurso() {
  try {
    console.log('🚀 Connecting to Turso database...');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log('📋 Reading current schema...');
    const schema = fs.readFileSync('./current_schema.sql', 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
      .map(stmt => stmt + ';');

    console.log(`🔧 Applying ${statements.length} schema statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        await client.execute(statement);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`  ✅ Table/column already exists, skipping...`);
        } else {
          console.error(`  ❌ Error executing statement:`, error.message);
        }
      }
    }
    
    // Test that AuthCredentials table exists
    console.log('🔍 Testing AuthCredentials table...');
    const result = await client.execute('SELECT COUNT(*) as count FROM auth_credentials');
    console.log('✅ AuthCredentials table exists with', result.rows[0].count, 'records');
    
    await client.close();
    console.log('✅ Schema applied successfully to Turso database');
    
  } catch (error) {
    console.error('❌ Failed to apply schema to Turso:', error);
  }
}

applySchemaToTurso();
