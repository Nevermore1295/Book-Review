import { component } from "./component.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAA--PpoUl0p1Pjp3vubEVej9axE9xsE-8",
    authDomain: "book-review-ac765.firebaseapp.com",
    projectId: "book-review-ac765",
    storageBucket: "book-review-ac765.appspot.com",
    messagingSenderId: "275710298289",
    appId: "1:275710298289:web:b86e1cc2130d6ee8c17a90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

export const userAuth = (token) => {
    if (token == true)
        return component.navbarUsername;
    else 
        return component.navbarLoginForm;
}