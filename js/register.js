import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"
import { getFirestore, collection, query, where, doc, addDoc ,setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"
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
const db = getFirestore(app)
const storage = getStorage()

export const registerForm = document.getElementById('register');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user info
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const pwcf = document.getElementById('pwconfirmation').value

    // Register user
    if (username.trim() === '') {
        console.log('Missing username')
    } else if (username.trim().length < 6) {
        console.log('Username must be at least 6 characters')
    } else if (password !== pwcf) {
        console.log('Password and password confirmation must be the same')
    } else if (password === pwcf) {
        let exist = false
        const q = query(collection(db, 'users'), where('username', '==', username.trim()))
        getDocs(q).then(d => {
            d.forEach(data => {
                if (data.exists) {
                    exist = true
                }
            })
            if (!exist) {
                createUserWithEmailAndPassword(auth, email, password).then(cred => {
                    // Create data firestore
                    const initialData = {
                        username: username.trim(),
                        email: email.trim(),
                        type: 'writer'
                    }
                    const docRef = doc(db, 'User', cred.user.uid)
                    addDoc(docRef, initialData, { merge: false })
                    console.log(`User ${username} successfully registered`)
                    updateProfile(auth.currentUser, {displayName: username,})
                }).then(() => {
                    // Reset form
                    registerForm.reset()
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
            } else {
                console.log("This username has already been taken")
            }
        })
    }
})

