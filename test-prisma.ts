import { prisma } from './lib/db';

// Test if Prisma models are available
async function testPrismaModels() {
  const userCount = await prisma.user.count();
  const sessionCount = await prisma.userSession.count();
  console.log('User count:', userCount);
  console.log('Session count:', sessionCount);
}

export default testPrismaModels;
