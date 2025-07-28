#!/usr/bin/env node

// Test script for coupon delete functionality
async function testDeleteWithRateLimit() {
  const BASE_URL = 'http://localhost:3001/api';
  
  console.log('🧪 Testing Coupon Delete with Rate Limiting...\n');

  // First, get the list of coupons
  try {
    console.log('📋 Fetching existing coupons...');
    const response = await fetch(`${BASE_URL}/coupons`);
    const coupons = await response.json();
    console.log(`Found ${coupons.length} coupons`);
    
    if (coupons.length === 0) {
      console.log('❌ No coupons found to test delete operation');
      return;
    }

    // Test single delete operation
    const testCoupon = coupons[0];
    console.log(`\n🗑️ Testing delete of coupon: ${testCoupon.code} (ID: ${testCoupon.id})`);
    
    const deleteResponse = await fetch(`${BASE_URL}/coupons/${testCoupon.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (deleteResponse.ok) {
      console.log('✅ Delete operation successful!');
      console.log(`Status: ${deleteResponse.status}`);
    } else {
      console.log(`❌ Delete failed with status: ${deleteResponse.status}`);
      
      if (deleteResponse.status === 429) {
        const errorData = await deleteResponse.json();
        console.log(`Rate limit error: ${errorData.error}`);
      } else {
        const errorData = await deleteResponse.json();
        console.log(`Error: ${errorData.error}`);
      }
    }

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }

  console.log('\n✨ Rate limit test completed!');
}

// Run the test
testDeleteWithRateLimit().catch(console.error);
