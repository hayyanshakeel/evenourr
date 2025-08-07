// Test script to verify admin authentication is working
const axios = require('axios');

const baseURL = 'http://localhost:3002';

async function testAdminAuth() {
  console.log('Testing admin authentication...\n');
  
  try {
    // Test without authentication - should fail with 401
    console.log('1. Testing API access without auth token...');
    try {
      const response = await axios.get(`${baseURL}/api/admin/dashboard/metrics`);
      console.log('❌ FAILED: Should have returned 401, but got:', response.status);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ PASSED: Correctly returned 401 for unauthenticated request');
      } else {
        console.log('❌ FAILED: Unexpected error:', error.message);
      }
    }
    
    // Test with invalid token - should fail with 401
    console.log('\n2. Testing API access with invalid auth token...');
    try {
      const response = await axios.get(`${baseURL}/api/admin/dashboard/metrics`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      console.log('❌ FAILED: Should have returned 401, but got:', response.status);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ PASSED: Correctly returned 401 for invalid token');
      } else {
        console.log('❌ FAILED: Unexpected error:', error.message);
      }
    }
    
    // Test other admin endpoints
    const adminEndpoints = [
      '/api/admin/products',
      '/api/admin/orders',
      '/api/admin/customers',
      '/api/admin/dashboard/stats'
    ];
    
    console.log('\n3. Testing other admin endpoints without auth...');
    for (const endpoint of adminEndpoints) {
      try {
        const response = await axios.get(`${baseURL}${endpoint}`);
        console.log(`❌ FAILED: ${endpoint} should have returned 401, but got:`, response.status);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(`✅ PASSED: ${endpoint} correctly returned 401`);
        } else {
          console.log(`❌ FAILED: ${endpoint} unexpected error:`, error.message);
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

testAdminAuth();
