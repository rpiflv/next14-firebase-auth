import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_FIREBASE_APIKEY,
  authDomain: "menhera-login.firebaseapp.com",
  projectId: "menhera-login",
  storageBucket: "menhera-login.appspot.com",
  messagingSenderId: "973568778845",
  appId: "1:973568778845:web:c2a8f50a2f8023caf323b4",
  measurementId: "G-9XC7MY0JTW"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

console.log(process.env.NEXT_PUBLIC_REACT_FIREBASE_APIKEY);

export {app, auth, db };
