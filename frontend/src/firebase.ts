// Firebase client SDK config — ascend-membership-app (single source of truth)
// Shared project with FlutterFlow Pages 001-008
// Created: 24 Feb 2026 — Firebase consolidation alignment
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNVupJz3A2UC6SsxinwtvSKmLjDOmQb0w",
  authDomain: "ascend-membership-app.firebaseapp.com",
  projectId: "ascend-membership-app",
  storageBucket: "ascend-membership-app.firebasestorage.app",
  messagingSenderId: "610720374935",
  appId: "1:610720374935:web:fc2ef58996a6b1b83b09d2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
