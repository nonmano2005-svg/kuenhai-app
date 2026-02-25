import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCBJqFykI6mUe2s2NBf3wRE6DSHB4tQg7c",
    authDomain: "kuenhai-v2.firebaseapp.com",
    projectId: "kuenhai-v2",
    storageBucket: "kuenhai-v2.firebasestorage.app",
    messagingSenderId: "965953909852",
    appId: "1:965953909852:web:30daee4308d6ba93472299",
    measurementId: "G-202SRCFZW4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider(); 