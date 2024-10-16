// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRW_629KZasEdjIOV63ncfTdfV08klWCo",
  authDomain: "stripesaas-55405.firebaseapp.com",
  projectId: "stripesaas-55405",
  storageBucket: "stripesaas-55405.appspot.com",
  messagingSenderId: "521780255710",
  appId: "1:521780255710:web:657857fab8f589da925b4f",
  measurementId: "G-T85DMPW69Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}