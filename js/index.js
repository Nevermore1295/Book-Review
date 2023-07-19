import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
