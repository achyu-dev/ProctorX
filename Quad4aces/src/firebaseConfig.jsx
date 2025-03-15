// Import the functions you need from the SDKs you ne
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYlbUkiQhlvaGDphiB9VZLPHrrJ6jNx60",
  authDomain: "exam-proctor-58e4c.firebaseapp.com",
  projectId: "exam-proctor-58e4c",
  storageBucket: "exam-proctor-58e4c.firebasestorage.app",
  messagingSenderId: "942076339924",
  appId: "1:942076339924:web:31d05c703655171c8bbd41",
  measurementId: "G-KLECNHJLTN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

