// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "renttracker-75c45.firebaseapp.com",
    projectId: "renttracker-75c45",
    storageBucket: "renttracker-75c45.appspot.com",
    messagingSenderId: "854106776073",
    appId: "1:854106776073:web:3d6c7cbaefd76c314fced8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);