// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhOOV9h-Jy5I9N7Tcf0BLL4MTEbIhzg7I",
  authDomain: "inventory-2947a.firebaseapp.com",
  projectId: "inventory-2947a",
  storageBucket: "inventory-2947a.appspot.com",
  messagingSenderId: "196761585554",
  appId: "1:196761585554:web:0c588b1e85a032ae76e34b",
  measurementId: "G-FW9EB6TZ0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore= getFirestore(app)
export {firestore}