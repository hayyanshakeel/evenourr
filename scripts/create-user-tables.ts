import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function createUserTables() {
  try {
    // Create User table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        isActive BOOLEAN DEFAULT 1,
        emailVerified BOOLEAN DEFAULT 0,
        emailVerificationToken TEXT,
        passwordResetToken TEXT,
        passwordResetExpires DATETIME,
        lastLogin DATETIME,
        failedLoginAttempts INTEGER DEFAULT 0,
        lockedUntil DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create UserSession table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS UserSession (
        id TEXT PRIMARY KEY,
        userId INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
      )
    `);

    // Update Cart table to add userId relation
    await client.execute(`
      ALTER TABLE Cart ADD COLUMN userId INTEGER REFERENCES User(id) ON DELETE CASCADE
    `);

    console.log('✅ User tables created successfully in Turso!');
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate column name')) {
      console.log('✅ Tables already exist or partially exist - this is normal');
    } else {
      console.error('❌ Error creating tables:', error);
    }
  } finally {
    client.close();
  }
}

createUserTables();
