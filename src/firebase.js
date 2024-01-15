// Import the functions you need from the SDKs you need
import { initializeApp ,firebase } from "firebase/app";
import 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqIXcB5TdiCTBoOxrjU9Pj2hN-DS8d0og",
  authDomain: "chat-application-50668.firebaseapp.com",
  databaseURL: "https://chat-application-50668-default-rtdb.firebaseio.com",
  projectId: "chat-application-50668",
  storageBucket: "chat-application-50668.appspot.com",
  messagingSenderId: "377104481699",
  appId: "1:377104481699:web:ea1465e845ad46adbfae16",
  measurementId: "G-WW9D07KLPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);