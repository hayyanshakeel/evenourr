/**
 * Setup Enterprise Admin Account
 * Creates the initial admin account in AuthCredentials table
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdminAccount() {
  try {
    console.log('🔐 Setting up enterprise admin account...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.authCredentials.findUnique({
      where: { email: 'admin@evenour.co' }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin account already exists');
      return;
    }
    
    // Hash admin password
    const adminPassword = 'Hayyaan123@1';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    const salt = await bcrypt.genSalt(16);
    
    // Create admin user first
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@evenour.co',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      }
    });
    
    // Create admin auth credentials
    await prisma.authCredentials.create({
      data: {
        email: 'admin@evenour.co',
        passwordHash: hashedPassword,
        salt: salt,
        isActive: true,
        securityLevel: 'MAXIMUM',
        storeName: 'AdminStore',
        userId: adminUser.id,
      }
    });
    
    console.log('✅ Enterprise admin account created:');
    console.log('   Email: admin@evenour.co');
    console.log('   Password: Hayyaan123@1');
    console.log('   Security Level: MAXIMUM');
    
  } catch (error) {
    console.error('❌ Failed to setup admin account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminAccount();
