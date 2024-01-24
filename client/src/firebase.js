// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-8d915.firebaseapp.com",
  projectId: "mern-auth-8d915",
  storageBucket: "mern-auth-8d915.appspot.com",
  messagingSenderId: "962126601749",
  appId: "1:962126601749:web:b4c056684767de6fd8781c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);