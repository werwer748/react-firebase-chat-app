// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYeXZ3Jb1HBkcYGTzRWlMcKHxeheuz0dM",
  authDomain: "react-firebase-chat-app-411d6.firebaseapp.com",
  projectId: "react-firebase-chat-app-411d6",
  storageBucket: "react-firebase-chat-app-411d6.appspot.com",
  messagingSenderId: "187971538528",
  appId: "1:187971538528:web:faca49dddfb002f5637d05",
  measurementId: "G-DHNPED28JB",
  databaseURL: "https://react-firebase-chat-app-411d6-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export default app;