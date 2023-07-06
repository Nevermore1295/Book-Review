import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword ,updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { auth,db } from "./module.js";




export const controller = {}

controller.login = async (initialData) =>{
    return signInWithEmailAndPassword(auth, initialData.email, initialData.password);
}


controller.register = async (initialData) =>{
    let exist = false;
    const q = await query(collection(db, 'users'), where('username', '==', initialData.username.trim()));
    await getDocs(q).then( async (d) => {
        d.forEach(data => {
            if (data.exists) {
                exist = true;
            }
        })
        if (!exist) {
            await createUserWithEmailAndPassword(auth, initialData.email, initialData.password).then(cred => {
                // Create data firestore
                const docRef = doc(db, 'User', cred.user.uid)
                setDoc(docRef, initialData, { merge: false })
                console.log(`User ${initialData.username} successfully registered`)
                updateProfile(auth.currentUser, {displayName: initialData.username,})
            }).catch(err => {
                // Catch error
                console.log(err.message)
            })
        } else {
            console.log("This username has already been taken")
        }
    })
}


controller.getCurrentCommentQuery = async (comment_review_id) => {
    return await (query(collection(db,'Comment'),and(where('comment_review_id','==',comment_review_id),where('comment_parent_id','==',null))));
}



controller.addComment = async (initialData) =>{
    return await addDoc(collection(db, 'Comment'),initialData);
}
