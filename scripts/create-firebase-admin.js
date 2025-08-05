#!/usr/bin/env node

// Firebase Admin User Creation Script
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } = require('firebase/auth');

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

async function createAdminUser() {
  try {
    console.log('🔐 Creating Firebase admin user...');
    
    // Create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'evenour.in@gmail.com',
      'Hayyaan123@1'
    );

    // Update display name
    await updateProfile(userCredential.user, {
      displayName: 'Admin User'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: evenour.in@gmail.com');
    console.log('Password: Hayyaan123@1');
    console.log('Display Name: Admin User');
    console.log('UID:', userCredential.user.uid);
    
    // Sign out
    await auth.signOut();
    console.log('👋 Signed out successfully');

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin user already exists. Testing login...');
      
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          'evenour.in@gmail.com',
          'Hayyaan123@1'
        );
        console.log('✅ Admin login test successful!');
        console.log('UID:', userCredential.user.uid);
        console.log('Email:', userCredential.user.email);
        console.log('Display Name:', userCredential.user.displayName);
        await auth.signOut();
      } catch (loginError) {
        console.error('❌ Admin login test failed:', loginError.message);
      }
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}

createAdminUser().then(() => {
  console.log('🏁 Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
