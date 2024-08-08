// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgtg5m2xBXHmaKtFgNDSidwbc2rx-FUeg",
  authDomain: "inventory-management-d3691.firebaseapp.com",
  projectId: "inventory-management-d3691",
  storageBucket: "inventory-management-d3691.appspot.com",
  messagingSenderId: "266599618223",
  appId: "1:266599618223:web:62da913fbe57b2ce1da65a",
  measurementId: "G-8M6G7DDBEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}