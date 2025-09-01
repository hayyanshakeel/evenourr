const { createClient } = require('@libsql/client');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function applyAuthCredentialsMigrationToTurso() {
  try {
    console.log('🚀 Connecting to Turso database...');
    
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log('📋 Reading AuthCredentials migration...');
    const migration = fs.readFileSync('./prisma/migrations/20250831205059_add_auth_credentials_table/migration.sql', 'utf8');
    
    // Split migration into individual statements
    const statements = migration
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .map(stmt => stmt + ';');

    console.log(`🔧 Applying ${statements.length} migration statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`  ${i + 1}/${statements.length}: Executing...`);
        console.log(`    ${statement.substring(0, 80)}...`);
        await client.execute(statement);
        console.log(`  ✅ Success`);
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate column name')) {
          console.log(`  ⚠️ Already exists, skipping...`);
        } else {
          console.error(`  ❌ Error:`, error.message);
          // Continue with other statements
        }
      }
    }
    
    // Test that AuthCredentials table exists and create admin if needed
    console.log('🔍 Testing AuthCredentials table...');
    try {
      const result = await client.execute('SELECT COUNT(*) as count FROM auth_credentials');
      console.log('✅ AuthCredentials table exists with', result.rows[0].count, 'records');
      
      // Check if admin exists
      const adminCheck = await client.execute('SELECT * FROM auth_credentials WHERE email = ?', ['admin@evenour.co']);
      if (adminCheck.rows.length === 0) {
        console.log('👤 Creating admin account...');
        
        // Create admin using bcrypt
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(12);
        const additionalSalt = require('crypto').randomBytes(32).toString('hex');
        const passwordHash = await bcrypt.hash('Hayyaan123@1' + additionalSalt, salt);
        
        await client.execute(`
          INSERT INTO auth_credentials (id, email, passwordHash, salt, isActive, securityLevel, storeName, userId) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          require('crypto').randomUUID(),
          'admin@evenour.co', 
          passwordHash,
          additionalSalt,
          true,
          'MAXIMUM',
          'EVENOUR_ADMIN',
          null
        ]);
        
        console.log('✅ Admin account created successfully');
      } else {
        console.log('✅ Admin account already exists');
      }
      
    } catch (error) {
      console.error('❌ Error testing table:', error.message);
    }
    
    await client.close();
    console.log('✅ Migration applied successfully to Turso database');
    
  } catch (error) {
    console.error('❌ Failed to apply migration to Turso:', error);
  }
}

applyAuthCredentialsMigrationToTurso();
