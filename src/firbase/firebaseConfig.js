// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore"; // Correct import for Firestore
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAROHsJIP3mt8Dt8J-SwI6sAp4Fzv0AANA",
  authDomain: "bhasantar-21f5a.firebaseapp.com",
  projectId: "bhasantar-21f5a",
  storageBucket: "bhasantar-21f5a.appspot.com",
  messagingSenderId: "536431381184",
  appId: "1:536431381184:web:0f4b64067a3bd8238d7b25",
  measurementId: "G-R3FRT2T95L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const functions = getFunctions(app);
const db = getFirestore(app); // Correct initialization for Firestore
const storage = getStorage(app);

export { app, auth, functions, db, storage };
