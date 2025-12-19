import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// These values come from your .env file
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db = null;

// Initialize Firebase only if config is present
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => !!value);

if (isFirebaseConfigured) {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization failed:', error);
    }
} else {
    console.log('Firebase config missing. Falling back to local storage.');
}

export { db };
