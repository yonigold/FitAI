// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
// import functions from "firebase-functions";
import { getFunctions, httpsCallable } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAIQzkL8kgTKRRJFNHWu71XVYyf7Ahgro",
  authDomain: "myfit-ai.firebaseapp.com",
  projectId: "myfit-ai",
  storageBucket: "myfit-ai.appspot.com",
  messagingSenderId: "878050422488",
  appId: "1:878050422488:web:2751f6e22fe283412d31ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);


export default app;
