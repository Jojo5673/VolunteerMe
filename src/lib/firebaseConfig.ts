// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBW2kGMvKYwLQ31O37zZDVDXQ7-OO7vpEY",
  authDomain: "volunteerme-68487.firebaseapp.com",
  projectId: "volunteerme-68487",
  storageBucket: "volunteerme-68487.firebasestorage.app",
  messagingSenderId: "875738651609",
  appId: "1:875738651609:web:90ee43e989c448fc0097c8",
  measurementId: "G-TGE5EF1TCQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig): getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};