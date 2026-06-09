import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBT3z3t9VgYmc3elY3TE9xqQ_i2GeA2gcU",
  authDomain: "raja-furniture-1e1db.firebaseapp.com",
  projectId: "raja-furniture-1e1db",
  storageBucket: "raja-furniture-1e1db.firebasestorage.app",
  messagingSenderId: "851318931198",
  appId: "1:851318931198:web:d5336278589805c9f2efaf",
  measurementId: "G-F1NMYGK2NT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);