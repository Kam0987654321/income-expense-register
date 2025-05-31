// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyBbkRJkWtE6bny4L8cNlxo8TzKX4JrsX6s",
  authDomain: "income-and-exp.firebaseapp.com",
  projectId: "income-and-exp",
  storageBucket: "income-and-exp.firebasestorage.app",
  messagingSenderId: "737980514491",
  appId: "1:737980514491:web:b8824fa25caadbdb1c699e",
  measurementId: "G-5V0NH48HL9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
