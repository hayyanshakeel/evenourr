// Test returns and stats API endpoints with real Firebase token
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyA9ZAV7HoUUTaEzbGPz9_M4iFeiLDYmLBo",
  authDomain: "evenour-auth-app.firebaseapp.com",
  projectId: "evenour-auth-app",
  storageBucket: "evenour-auth-app.appspot.com",
  messagingSenderId: "228539073003",
  appId: "1:228539073003:web:64669dd81f0454db1459ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testReturnsEndpoints() {
  try {
    console.log('🔑 Signing in to Firebase...');
    const userCredential = await signInWithEmailAndPassword(auth, 'evenour.in@gmail.com', 'Hayyaan123@1');
    console.log('✅ Signed in successfully:', userCredential.user.uid);
    
    const token = await userCredential.user.getIdToken();
    console.log('✅ Got Firebase token:', token.substring(0, 50) + '...');
    
    // Test 1: Returns endpoint
    console.log('\n📡 Testing /api/admin/returns endpoint...');
    try {
      const returnsResponse = await fetch('http://localhost:3001/api/admin/returns', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Returns Response Status:', returnsResponse.status);
      console.log('📊 Returns Response Headers:', Object.fromEntries(returnsResponse.headers.entries()));
      
      const returnsText = await returnsResponse.text();
      console.log('📊 Returns Response Body:', returnsText);
      
      if (returnsResponse.ok) {
        console.log('✅ Returns endpoint successful!');
        const returnsData = JSON.parse(returnsText);
        console.log('📊 Returns count:', returnsData.returns?.length || 0);
      } else {
        console.log('❌ Returns endpoint failed');
      }
    } catch (error) {
      console.error('❌ Returns endpoint error:', error.message);
      if (error.cause) {
        console.error('❌ Error cause:', error.cause);
      }
    }
    
    // Test 2: Returns stats endpoint
    console.log('\n📈 Testing /api/admin/returns/stats endpoint...');
    try {
      const statsResponse = await fetch('http://localhost:3001/api/admin/returns/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Stats Response Status:', statsResponse.status);
      console.log('📊 Stats Response Headers:', Object.fromEntries(statsResponse.headers.entries()));
      
      const statsText = await statsResponse.text();
      console.log('📊 Stats Response Body:', statsText);
      
      if (statsResponse.ok) {
        console.log('✅ Stats endpoint successful!');
        const statsData = JSON.parse(statsText);
        console.log('📊 Total returns:', statsData.totalReturns || 0);
      } else {
        console.log('❌ Stats endpoint failed');
      }
    } catch (error) {
      console.error('❌ Stats endpoint error:', error.message);
      if (error.cause) {
        console.error('❌ Error cause:', error.cause);
      }
    }
    
    // Test 3: With query parameters
    console.log('\n📈 Testing returns with query parameters...');
    try {
      const paramsResponse = await fetch('http://localhost:3001/api/admin/returns?page=1&limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Params Response Status:', paramsResponse.status);
      const paramsText = await paramsResponse.text();
      console.log('📊 Params Response Body:', paramsText.substring(0, 500) + '...');
      
      if (paramsResponse.ok) {
        console.log('✅ Returns with params successful!');
      } else {
        console.log('❌ Returns with params failed');
      }
    } catch (error) {
      console.error('❌ Returns with params error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testReturnsEndpoints();
