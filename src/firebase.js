// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCBQqFykI6mUe2s2NBf3wRE6D5HB4tQg7c",
    authDomain: "kuenhai-v2.firebaseapp.com",
    projectId: "kuenhai-v2",
    storageBucket: "kuenhai-v2.firebasestorage.app",
    messagingSenderId: "965953909852",
    appId: "1:965953909852:web:30daee4300d6ba93472299",
    measurementId: "G-202SRCF2W4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);