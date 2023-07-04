
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"
import { getFirestore, collection, query, where, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js"

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
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()
const storage = getStorage()


export const loginForm = document.getElementById('login')
console.log(loginForm)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Get user info
    const email = document.getElementById('email-login').value
    const password = document.getElementById('password-login').value

    // Login user
    signInWithEmailAndPassword(auth, email, password).then(user => {
        console.log(`User ${user.user.displayName} successfully logged in`)
        // Store the current UserId in local storage
        //localStorage.setItem("currentUserId",JSON.stringify(user.user.id));
        // app.updateCurrentUser(user.user)
        // const uid = user.uid;

        // Reset form
        loginForm.reset()
    }).catch(err => {
        // Catch error
        console.log(err.message)
    })
})


