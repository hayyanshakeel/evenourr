// Test script for admin-data.ts
const { execSync } = require('child_process');

console.log('🧪 Testing admin-data.ts for bugs and issues...\n');

// Test 1: TypeScript compilation
console.log('1. Testing TypeScript compilation...');
try {
  execSync('npx tsc --noEmit --skipLibCheck lib/admin-data.ts', { encoding: 'utf8' });
  console.log('✅ TypeScript compilation passed');
} catch (error) {
  console.error('❌ TypeScript compilation failed:');
  console.error(error.stdout);
}

// Test 2: Import/Export syntax
console.log('\n2. Testing module imports/exports...');
try {
  const fs = require('fs');
  const content = fs.readFileSync('lib/admin-data.ts', 'utf8');
  
  // Check for common issues
  const issues = [];
  
  // Check for mixed export patterns
  const hasNamedExports = content.includes('export const') || content.includes('export interface');
  const hasDefaultExports = content.includes('export default');
  if (hasNamedExports && hasDefaultExports) {
    issues.push('Mixed export patterns detected (both named and default exports)');
  }
  
  // Check for missing semicolons in critical places
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.trim().startsWith('export const') && !line.trim().endsWith(';') && !line.trim().endsWith('{')) {
      issues.push(`Line ${index + 1}: Missing semicolon after export const`);
    }
  });
  
  // Check for potential async/await issues
  const asyncFunctions = content.match(/async \w+:/g) || [];
  asyncFunctions.forEach(func => {
    if (!content.includes(`await ${func.replace('async ', '').replace(':', '')}`)) {
      console.log(`⚠️  Async function may not be properly awaited: ${func}`);
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ Module structure looks good');
  } else {
    console.log('⚠️  Found potential issues:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
} catch (error) {
  console.error('❌ Error reading file:', error.message);
}

// Test 3: Database schema compatibility
console.log('\n3. Testing database schema compatibility...');
try {
  const fs = require('fs');
  const adminDataContent = fs.readFileSync('lib/admin-data.ts', 'utf8');
  const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  // Extract model names from schema
  const modelMatches = schemaContent.match(/model (\w+) {/g) || [];
  const schemaModels = modelMatches.map(match => match.replace('model ', '').replace(' {', ''));
  
  // Check if admin-data uses models that exist in schema
  const prismaQueries = adminDataContent.match(/prisma\.(\w+)\./g) || [];
  const usedModels = [...new Set(prismaQueries.map(query => query.replace('prisma.', '').replace('.', '')))];
  
  const missingModels = usedModels.filter(model => !schemaModels.includes(model));
  if (missingModels.length > 0) {
    console.log('❌ Models used but not found in schema:', missingModels);
  } else {
    console.log('✅ All database models are properly defined');
  }
  
  console.log('📊 Schema models found:', schemaModels.join(', '));
  console.log('📊 Models used in admin-data:', usedModels.join(', '));
  
} catch (error) {
  console.error('❌ Error checking schema:', error.message);
}

// Test 4: Interface type safety
console.log('\n4. Testing interface definitions...');
try {
  const fs = require('fs');
  const content = fs.readFileSync('lib/admin-data.ts', 'utf8');
  
  // Extract interface definitions
  const interfaceMatches = content.match(/export interface (\w+) {[^}]+}/gs) || [];
  const interfaces = interfaceMatches.map(match => {
    const name = match.match(/interface (\w+)/)[1];
    const properties = (match.match(/(\w+)[\?]?:\s*([^;]+);/g) || []).map(prop => {
      const [, propName, propType] = prop.match(/(\w+)[\?]?:\s*([^;]+);/) || [];
      return { name: propName, type: propType?.trim() };
    });
    return { name, properties };
  });
  
  console.log(`✅ Found ${interfaces.length} interface definitions:`);
  interfaces.forEach(iface => {
    console.log(`   - ${iface.name} (${iface.properties.length} properties)`);
  });
  
  // Check for potential issues
  interfaces.forEach(iface => {
    iface.properties.forEach(prop => {
      if (prop.type && prop.type.includes('any')) {
        console.log(`⚠️  ${iface.name}.${prop.name} uses 'any' type - consider being more specific`);
      }
    });
  });
  
} catch (error) {
  console.error('❌ Error analyzing interfaces:', error.message);
}

// Test 5: Async/Promise handling
console.log('\n5. Testing async/promise patterns...');
try {
  const fs = require('fs');
  const content = fs.readFileSync('lib/admin-data.ts', 'utf8');
  
  // Check for proper error handling
  const asyncFunctions = content.match(/async \([^)]*\) => {[^}]+}/gs) || [];
  const hasTryCatch = content.includes('try {') && content.includes('catch');
  
  if (!hasTryCatch && asyncFunctions.length > 0) {
    console.log('⚠️  Async functions found but no try/catch error handling detected');
  }
  
  // Check for Promise.all usage
  const promiseAllCount = (content.match(/Promise\.all/g) || []).length;
  console.log(`✅ Found ${promiseAllCount} Promise.all() optimizations`);
  
  // Check for potential race conditions
  const awaitCount = (content.match(/await /g) || []).length;
  console.log(`✅ Found ${awaitCount} await statements`);
  
} catch (error) {
  console.error('❌ Error analyzing async patterns:', error.message);
}

console.log('\n🎉 Admin-data testing complete!');
console.log('\n💡 To run actual database tests, start the dev server and use API endpoints:');
console.log('   curl http://localhost:3001/api/admin/products');
console.log('   curl http://localhost:3001/api/admin/orders');
console.log('   curl http://localhost:3001/api/admin/dashboard/metrics');
