import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB8_m2GnTy-FtvAxz3qfpi0rKznFkKlagE",
    authDomain: "kuenhai-app.firebaseapp.com",
    projectId: "kuenhai-app",
    storageBucket: "kuenhai-app.firebasestorage.app",
    messagingSenderId: "998792659773",
    appId: "1:998792659773:web:f05d0c54389d69ac13fb54"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();