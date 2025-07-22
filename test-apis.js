// Test script to verify API functionality
// Run with: node test-apis.js

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make requests
async function testAPI(method, endpoint, body = null) {
  console.log(`\n📍 Testing ${method} ${endpoint}`);
  
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
    
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', JSON.stringify(data, null, 2));
    
    return { success: response.ok, data };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test suite
async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  // Test 1: Get all products
  await testAPI('GET', '/products');
  
  // Test 2: Create a product
  const newProduct = await testAPI('POST', '/products', {
    title: 'Test Product',
    description: 'This is a test product',
    price: 2999, // $29.99
    handle: 'test-product-' + Date.now(),
    inventory: 100,
    imageUrl: 'https://example.com/image.jpg'
  });
  
  // Test 3: Get dashboard stats
  await testAPI('GET', '/dashboard/stats?period=30');
  
  // Test 4: Get all customers
  await testAPI('GET', '/customers');
  
  // Test 5: Create a customer
  const newCustomer = await testAPI('POST', '/customers', {
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'Customer',
    phone: '+1234567890'
  });
  
  // Test 6: Get all orders
  await testAPI('GET', '/orders');
  
  // Test 7: Create an order
  if (newProduct.success && newProduct.data) {
    await testAPI('POST', '/orders', {
      email: 'order@example.com',
      items: [{
        productId: newProduct.data.id,
        title: newProduct.data.title,
        price: newProduct.data.price,
        quantity: 1
      }],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        province: 'NY',
        country: 'US',
        zip: '10001'
      }
    });
  }
  
  // Test 8: Get all coupons
  await testAPI('GET', '/coupons');
  
  // Test 9: Create a coupon
  await testAPI('POST', '/coupons', {
    code: 'TEST' + Date.now(),
    description: 'Test coupon',
    discountType: 'percentage',
    discountValue: 10,
    minimumPurchase: 5000 // $50.00
  });
  
  console.log('\n✨ API Tests Complete!');
}

// Check if running in Node.js
if (typeof window === 'undefined') {
  console.log('⚠️  Make sure your Next.js dev server is running on http://localhost:3000');
  console.log('⚠️  Run: npm run dev\n');
  
  // Wait 2 seconds then run tests
  setTimeout(runTests, 2000);
} else {
  console.log('This script should be run with Node.js: node test-apis.js');
}
