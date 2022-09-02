// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGHw7HYIfpVny4_yWcypYozhYpxD7q194",
  authDomain: "ajebo-property.firebaseapp.com",
  projectId: "ajebo-property",
  storageBucket: "ajebo-property.appspot.com",
  messagingSenderId: "353215196945",
  appId: "1:353215196945:web:52ae380ba30bf7e7a466b0"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()