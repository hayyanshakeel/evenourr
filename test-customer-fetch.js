// Test customer fetch API
async function testCustomerFetch() {
  try {
    console.log('Testing customer fetch...');
    
    // Get Firebase token first
    const { initializeApp } = await import('firebase/app');
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    
    const firebaseConfig = {
      apiKey: "AIzaSyA9ZAV7HoUUTaEzbGPz9_M4iFeiLDYmLBo",
      authDomain: "evenour-auth-app.firebaseapp.com",
      projectId: "evenour-auth-app",
      storageBucket: "evenour-auth-app.appspot.com",
      messagingSenderId: "678978714648",
      appId: "1:678978714648:web:7c123d4e5f5b2e5e123456",
      measurementId: "G-1234567890"
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Sign in (you'll need to provide credentials)
    const userCredential = await signInWithEmailAndPassword(auth, "evenour.in@gmail.com", "your-password");
    const token = await userCredential.user.getIdToken();
    
    console.log('Got token:', token.substring(0, 20) + '...');
    
    // Test the API
    const response = await fetch('http://localhost:3000/api/admin/customers', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run if in Node.js environment
if (typeof window === 'undefined') {
  testCustomerFetch();
}
