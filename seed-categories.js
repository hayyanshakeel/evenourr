const { PrismaClient } = require('@prisma/client');

async function seedCategories() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking existing categories...');
    const existing = await prisma.category.findMany();
    console.log('Existing categories:', existing);
    
    console.log('Creating categories...');
    
    // Create categories
    const categories = [
      { name: 'Clothing' },
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Home & Garden' },
      { name: 'Sports & Outdoors' }
    ];
    
    for (const categoryData of categories) {
      try {
        const category = await prisma.category.upsert({
          where: { name: categoryData.name },
          update: {},
          create: categoryData
        });
        console.log('Created/found category:', category);
      } catch (error) {
        console.error(`Error with category ${categoryData.name}:`, error);
      }
    }
    
    console.log('Categories seeded successfully!');
    
    // Verify categories exist
    const allCategories = await prisma.category.findMany();
    console.log('All categories in DB:', allCategories);
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
