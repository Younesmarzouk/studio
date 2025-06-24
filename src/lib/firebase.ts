// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBF0l3DGgb7UjN__KZz2t2WsLcfvOdzwA4",
    authDomain: "khidmti55.firebaseapp.com",
    projectId: "khidmti55",
    storageBucket: "khidmti55.firebasestorage.app",
    messagingSenderId: "706498470888",
    appId: "1:706498470888:web:bf66560eb9654bd0e07a5d",
    measurementId: "G-RFQ9N7TCF9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
