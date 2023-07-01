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
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();



const commentForm = document.getElementById('comment');
console.log(commentForm);
console.log(auth);
commentForm.addEventListener('submit', (cf) =>{
    cf.preventDefault();

    // Get comment content
        const commentContent = document.getElementById('comment-content').value;
        console.log(commentContent);

    // Get the current User
        const currentUser = auth.currentUser;
        console.log(auth);

    // Get user info that is working
        // const q = query(collection(db, 'user'), where('user_id', '==', currentUserId))
        // const d = doc(q);
    
    //Create data firestore 
        const initialData = {
            comment_creator_id: auth.currentUser,
            comment_content: commentContent,
            comment_created_date:2
        }

        const docRef = doc(db, 'Comment');
        setDoc(docRef, initialData, { merge: false }).then(() => {
            // Reset form
            commentForm.reset()
        }).catch(err => {
            // Catch error
            console.log(err.message)
        })
        console.log(`User ${username} successfully comment`);
})




