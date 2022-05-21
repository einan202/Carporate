// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
// Required for side-effects


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA75uTWNw6B8NMScQjcHytenSGB4v1nFMw",
  authDomain: "carpool-54fdc.firebaseapp.com",
  databaseURL: "https://carpool-54fdc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carpool-54fdc",
  storageBucket: "carpool-54fdc.appspot.com",
  messagingSenderId: "84281939718",
  appId: "1:84281939718:web:a0e5c1bc4cb992b7217087",
  measurementId: "G-5Q6TDMPBXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const auth = getAuth(app);
const functions = getFunctions();
export {db, auth, functions, httpsCallable};



 