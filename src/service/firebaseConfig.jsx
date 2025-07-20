import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_id",
  authDomain: "ai-planner-3e27b.firebaseapp.com",
  projectId: "ai-planner-3e27b",
  storageBucket: "ai-planner-3e27b.appspot.com",  // ✅ FIXED
  messagingSenderId: "117611873258",
  appId: "1:117611873258:web:341410dce69987124fa893",
  measurementId: "G-DWVKB3J339"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
