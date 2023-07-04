import { component } from "./component.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, doc, addDoc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
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

let view = {};

//Hàm khởi tạo module script 
function createModule(src){
    const script = document.createElement('script');
    script.setAttribute('type','module');
    script.setAttribute('src',src);
    return script;
}


//Các biến script element
const script1 = createModule('../js/login.js');
const script2 = createModule('../js/comment.js');
const script3 = createModule('../js/register.js');

view.currentScreen = '';
//Thay đổi giao diện
view.setScreen = async (screenName) => {

    const body = document.getElementsByTagName('body')[0];
    

    switch (screenName){
        case 'homeScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.homeContent + component.footer;

            const loginForm = document.getElementById('login');
            console.log(loginForm);
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get user info
                const email = document.getElementById('email-login').value;
                const password = document.getElementById('password-login').value;

                // Login user
                await signInWithEmailAndPassword(auth, email, password).then(user => {
                    console.log(`User ${user.user.displayName} successfully logged in`);
                    // Store the current UserId in local storage
                    //localStorage.setItem("currentUserId",JSON.stringify(user.user.id));
                    // app.updateCurrentUser(user.user)
                    // const uid = user.uid;

                    // Reset form
                    loginForm.reset();
                }).catch(err => {
                    // Catch error
                    console.log(err.message);
                })
            })
                        
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('register').style.cursor = 'pointer';
            document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen')); 
            document.querySelectorAll('.reviewScreen').forEach(element=>{
                element.setAttribute('style','{cursor:pointer;}');
                element.addEventListener('click',()=>view.setScreen('reviewScreen'));
            })

            break;

        case 'reviewScreen':
            document.getElementById('app').innerHTML = component.navbar + component.reviewContent + component.footer;
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            
            const commentForm = document.getElementById('comment');
            console.log(commentForm);
            console.log(auth);
            commentForm.addEventListener('submit', async (cf) =>{
                cf.preventDefault();
                // Get comment content
                    const commentContent = document.getElementById('comment-content').value;
                    console.log(commentContent);

                // Get user info that is working
                    // const q = query(collection(db, 'user'), where('user_id', '==', currentUserId))
                    // const d = doc(q);
                
                //Create data firestore 
                    const initialData = {
                        comment_creator_id: auth.currentUser.uid,
                        comment_content: commentContent,
                        comment_created_date: Date(cf)
                    }

                    const docRef = await addDoc(collection(db, 'Comment'),initialData).then(() => {
                        // Reset form
                        commentForm.reset()
                    }).catch(err => {
                        // Catch error
                        console.log(err.message)
                    })
                    console.log(`User ${auth.currentUser.displayName} successfully comment`);
            })

            break;
        
        case 'registerScreen':
            document.getElementById('app').innerHTML = component.registerNavbar + component.registerContent + component.footer;

            const registerForm = document.getElementById('register');
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
            
                // Get user info
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const pwcf = document.getElementById('pwconfirmation').value;
            
                // Register user
                if (username.trim() === '') {
                    console.log('Missing username')
                } else if (username.trim().length < 6) {
                    console.log('Username must be at least 6 characters')
                } else if (password !== pwcf) {
                    console.log('Password and password confirmation must be the same')
                } else if (password === pwcf) {
                    let exist = false;
                    const q = await resolve(query(collection(db, 'users'), where('username', '==', username.trim())));
                    await getDocs(q).then( async (d) => {
                        await d.forEach(data => {
                            if (data.exists) {
                                exist = true
                            }
                        })
                        if (!exist) {
                            await createUserWithEmailAndPassword(auth, email, password).then(cred => {
                                // Create data firestore
                                const initialData = {
                                    username: username.trim(),
                                    email: email.trim(),
                                    type: 'writer'
                                }
                                const docRef = doc(db, 'User', cred.user.uid)
                                setDoc(docRef, initialData, { merge: false })
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
            

            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));


            break;
        
        default:
            view.setScreen('homeScreen');
        break;

    }
}

view.setScreen();


view.userAuth = (token) => {
    if (token == true)
        return component.navbarUsername;
    else 
        return component.navbarLoginForm;
}