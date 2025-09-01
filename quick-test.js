/**
 * Quick Database Test
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickTest() {
  try {
    console.log('🧪 Quick Database Test...');
    
    // Check AuthCredentials table
    const count = await prisma.authCredentials.count();
    console.log(`📊 AuthCredentials records: ${count}`);
    
    // Check admin
    const admin = await prisma.authCredentials.findUnique({
      where: { email: 'admin@evenour.co' }
    });
    
    console.log('🔐 Admin exists:', !!admin);
    console.log('✅ Database connection working');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
