// Test authentication with real Firebase token
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

async function testRealAuth() {
  try {
    console.log('🔑 Signing in to Firebase...');
    const userCredential = await signInWithEmailAndPassword(auth, 'evenour.in@gmail.com', 'Hayyaan123@1');
    console.log('✅ Signed in successfully:', userCredential.user.uid);
    
    const token = await userCredential.user.getIdToken();
    console.log('✅ Got Firebase token:', token.substring(0, 50) + '...');
    
    // Test the API with the real token
    console.log('🌐 Testing API with real token...');
    
    // Use global fetch (Node.js 18+)
    const response = await fetch('http://localhost:3002/api/admin/dashboard/metrics', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📡 Response body:', text);
    
    if (response.ok) {
      console.log('✅ API call successful!');
    } else {
      console.log('❌ API call failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testRealAuth();
