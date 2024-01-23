// Import the functions you need from the SDKs you need
import { initializeApp, firebase } from "firebase/app";
import 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbvlNh0zpmV28Rm-6_eHDVZn1z1b6AYJk",
  authDomain: "aahaas-bb222.firebaseapp.com",
  databaseURL: "https://aahaas-bb222.firebaseio.com",
  projectId: "aahaas-bb222",
  storageBucket: "aahaas-bb222.appspot.com",
  messagingSenderId: "410570906249",
  appId: "1:410570906249:web:7011de846e1545b41fc458",
  measurementId: "G-NBE9YJNDGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);