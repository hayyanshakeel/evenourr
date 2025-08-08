import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
let firebaseConfig: {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
} = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Development fallback: if any required field missing, use known dev project
const missingClientEnv = !firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId;
if (process.env.NODE_ENV !== 'production' && missingClientEnv) {
  console.warn('[firebase] Missing NEXT_PUBLIC_FIREBASE_* env. Using dev fallback config.');
  firebaseConfig = {
    apiKey: 'AIzaSyA9ZAV7HoUUTaEzbGPz9_M4iFeiLDYmLBo',
    authDomain: 'evenour-auth-app.firebaseapp.com',
    projectId: 'evenour-auth-app',
    storageBucket: 'evenour-auth-app.appspot.com',
    messagingSenderId: '228539073003',
    appId: '1:228539073003:web:64669dd81f0454db1459ae',
  };
}

// Debug: Check if config is loaded
console.log('Firebase Config Check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Configure auth for better rate limiting
if (typeof window !== 'undefined') {
  // Only run in browser
  auth.settings.appVerificationDisabledForTesting = process.env.NODE_ENV === 'development';
  
  // Add custom timeout and retry settings
  auth.tenantId = null; // Ensure we're using the default tenant
}

export { app, auth };