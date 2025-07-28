#!/usr/bin/env node

const BASE_URL = 'http://localhost:3001/api';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}: ${response.status}`);
    if (response.status >= 400) {
      console.log(`   Error: ${JSON.stringify(data)}`);
    }
    return { status: response.status, data };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return { status: 500, error: error.message };
  }
}

async function testAllAPIs() {
  console.log('🚀 Testing All API Endpoints...\n');

  // Test Products
  console.log('📦 PRODUCTS:');
  await testAPI('/products');
  await testAPI('/products/1');
  
  // Test Collections
  console.log('\n📚 COLLECTIONS:');
  await testAPI('/collections');
  
  // Test Coupons
  console.log('\n🎫 COUPONS:');
  await testAPI('/coupons');
  await testAPI('/coupons/3');
  
  // Test Customers
  console.log('\n👥 CUSTOMERS:');
  await testAPI('/customers');
  
  // Test Orders
  console.log('\n📝 ORDERS:');
  await testAPI('/orders');
  
  // Test Categories
  console.log('\n🏷️ CATEGORIES:');
  await testAPI('/categories');
  
  // Test Dashboard Stats
  console.log('\n📊 DASHBOARD STATS:');
  await testAPI('/dashboard/stats');
  
  console.log('\n✨ All API tests completed!');
}

testAllAPIs().catch(console.error);
