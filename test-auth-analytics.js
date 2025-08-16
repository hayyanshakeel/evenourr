// Test authentication and analytics API
const admin = {
  email: 'evenour.in@gmail.com',
  password: 'Hayyaan123@1'
};

console.log('Testing authentication and analytics API...');

// Test with browser environment simulation
if (typeof window !== 'undefined') {
  console.log('Running in browser environment');
  
  // Import Firebase and test
  import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js').then(({ initializeApp }) => {
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js').then(({ getAuth, signInWithEmailAndPassword }) => {
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

      signInWithEmailAndPassword(auth, admin.email, admin.password)
        .then(async (userCredential) => {
          console.log('✅ Firebase login successful:', userCredential.user.email);
          
          const token = await userCredential.user.getIdToken();
          console.log('✅ Token obtained:', token.substring(0, 50) + '...');
          
          // Test the analytics API
          const response = await fetch('/api/analytics/visitors?timeframe=30d', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('📊 Analytics API response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Analytics data received:', Object.keys(data));
          } else {
            const error = await response.text();
            console.error('❌ Analytics API error:', error);
          }
        })
        .catch((error) => {
          console.error('❌ Login failed:', error.message);
        });
    });
  });
} else {
  console.log('Node.js environment - use browser console instead');
}
