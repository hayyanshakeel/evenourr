#!/usr/bin/env node

// Firebase Admin User Creation Script with Custom Claims
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const admin = require('firebase-admin');

const firebaseConfig = {
  apiKey: "AIzaSyA9ZAV7HoUUTaEzbGPz9_M4iFeiLDYmLBo",
  authDomain: "evenour-auth-app.firebaseapp.com",
  projectId: "evenour-auth-app",
  storageBucket: "evenour-auth-app.appspot.com",
  messagingSenderId: "228539073003",
  appId: "1:228539073003:web:64669dd81f0454db1459ae"
};

// Initialize Firebase Client (for creating user)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firebase Admin (for setting custom claims)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "evenour-auth-app",
    // Add your service account key here if needed
  });
}

async function createAdminUserWithClaims() {
  try {
    console.log('🔐 Creating Firebase admin user with custom claims...');
    
    const adminEmail = 'evenour.in@gmail.com';
    const adminPassword = 'Hayyaan123@1';
    
    // Step 1: Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );

    console.log('✅ Firebase user created successfully!');
    console.log('UID:', userCredential.user.uid);
    
    // Step 2: Update display name
    await updateProfile(userCredential.user, {
      displayName: 'Admin User'
    });

    // Step 3: Set custom claims for admin role
    await admin.auth().setCustomUserClaims(userCredential.user.uid, {
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      isAdmin: true
    });

    console.log('✅ Custom claims set successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Display Name: Admin User');
    console.log('🛡️  Role: admin');
    console.log('🔒 Admin privileges: enabled');
    
    // Sign out
    await auth.signOut();
    console.log('👋 Signed out successfully');

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  User already exists. Setting admin claims...');
      
      try {
        // Get user by email and set claims
        const userRecord = await admin.auth().getUserByEmail('evenour.in@gmail.com');
        
        await admin.auth().setCustomUserClaims(userRecord.uid, {
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin'],
          isAdmin: true
        });
        
        console.log('✅ Admin claims updated successfully!');
        console.log('UID:', userRecord.uid);
        console.log('📧 Email:', userRecord.email);
        console.log('🛡️  Role: admin');
        
      } catch (claimsError) {
        console.error('❌ Error setting custom claims:', claimsError.message);
      }
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
}

createAdminUserWithClaims().then(() => {
  console.log('🏁 Admin user creation completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
