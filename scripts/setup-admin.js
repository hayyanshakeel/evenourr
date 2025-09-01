/**
 * Admin User Setup Script
 * 
 * This script helps create the admin user in Firebase.
 * Run this once to set up the admin account.
 * 
 * Usage: node scripts/setup-admin.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase config - using the actual values from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyA9ZAV7HoUUTaEzbGPz9_M4iFeiLDYmLBo",
  authDomain: "evenour-auth-app.firebaseapp.com",
  projectId: "evenour-auth-app",
  storageBucket: "evenour-auth-app.appspot.com",
  messagingSenderId: "678978714648",
  appId: "1:678978714648:web:7c123d4e5f5b2e5e123456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function setupAdminUser() {
  const adminEmail = 'admin@evenour.co';
  const adminPassword = 'Hayyaan123@1';

  try {
    console.log('Setting up admin user...');
    
    // Try to create the admin user
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('✅ Admin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('UID:', userCredential.user.uid);
    } catch (createError) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Admin user already exists, testing login...');
        
        // Try to sign in with existing account
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('✅ Admin user login test successful!');
        console.log('UID:', userCredential.user.uid);
      } else {
        throw createError;
      }
    }
    
    console.log('\n🎉 Admin setup complete!');
    console.log('\nAdmin Credentials (KEEP SECURE):');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\n⚠️  Remember to remove this script or keep credentials secure in production!');
    
  } catch (error) {
    console.error('❌ Admin setup failed:', error.message);
    
    if (error.code === 'auth/too-many-requests') {
      console.log('\n💡 Too many requests. Please wait a few minutes and try again.');
    } else if (error.code === 'auth/network-request-failed') {
      console.log('\n💡 Network error. Please check your internet connection.');
    }
  }
  
  process.exit(0);
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the setup
setupAdminUser();
