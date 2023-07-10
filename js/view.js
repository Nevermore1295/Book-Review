import { component } from "./component.js";
import { auth , controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp, } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";




let view = {};

//Thay đổi giao diện
view.setScreen = (screenName) => {
    switch (screenName){
        case 'homeScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.homeContent + component.footer;
            auth.onAuthStateChanged((user)=>{
                console.log(auth.currentUser);
                if(auth.currentUser==null){
                    document.getElementById('user-auth').innerHTML=component.navbarLoginForm;
                    const loginForm = document.getElementById('login');
                    console.log(loginForm);
                    loginForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
        
                        // Get user info
                        const email = document.getElementById('email-login').value;
                        const password = document.getElementById('password-login').value;
        
                        const initialData = {
                            email: email.trim(),
                            password: password.trim(),
                        }
                        
                        controller.login(initialData);
                        loginForm.reset();  
                    })
    
                    document.getElementById('register').style.cursor = 'pointer';
                    document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen'));         
                } else {
                    document.getElementById('user-auth').innerHTML=component.navbarUsername;
                    const logOutButton = document.getElementById('log-out');
                    console.log(logOutButton);
                    logOutButton.addEventListener('click',()=>{
                        controller.logout();
                    })
                }
            })
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('review-btn').style.cursor = 'pointer';
            document.getElementById('review-btn').addEventListener('click', () => view.setScreen('review'));
            document.querySelectorAll('.reviewScreen').forEach(element=>{
                element.style.cursor='pointer';
                element.addEventListener('click',()=>view.setScreen('reviewScreen'));
            })
            break;


        case 'reviewScreen':
            document.getElementById('app').innerHTML = component.navbar + component.reviewContent + component.footer;
            
            
            //Load realtime-update comment
            view.showComment();

            const commentForm = document.getElementById('comment');
            commentForm.addEventListener('submit', (cf) =>{
                cf.preventDefault();
                // Get comment content
                const commentContent = document.getElementById('comment-content').value;

                //Create data firestore      
                const initialData = {
                    comment_creator_id: auth.currentUser.uid,
                    comment_created_date: Timestamp.now(),
                    comment_review_id:12,
                    comment_parent_id:null,
                    comment_content: commentContent.trim(),
                }

                //Add data to doc
                controller.addComment(initialData).then(() => {
                // Reset form
                commentForm.reset();

                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
                console.log(`User ${auth.currentUser.displayName} successfully comment`);              
                    
            })
        break;
        

        case 'registerScreen':
            document.getElementById('app').innerHTML = component.blankNavbar + component.registerContent + component.footer;

            const registerForm = document.getElementById('register');
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
            
                // Get user info
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const pwcf = document.getElementById('pwconfirmation').value;
            
                const initialData = {
                    username: username.trim(),
                    email: email.trim(),
                    password: password.trim(),
                    type: 'writer'
                }
                // Register user
                if (username.trim() === '') {
                    console.log('Missing username')
                } else if (username.trim().length < 6) {
                    console.log('Username must be at least 6 characters')
                } else if (password !== pwcf) {
                    console.log('Password and password confirmation must be the same')
                } else if (password === pwcf) {
                    controller.register(initialData).then(() => {
                        // Reset form
                        registerForm.reset()
                    }).catch(err => {
                        // Catch error
                        console.log(err.message)
                    });
                }
            })
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
        break;

        case 'review': 
            document.getElementById('app').innerHTML = component.navbar + component.reviewSearch + component.footer;
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            break;
        default:
            view.setScreen('homeScreen');
        break;

    }
}

view.setScreen();

view.showComment = async () =>{
    onSnapshot(await controller.getCurrentCommentQuery(12),(qr)=>{
        let str ='';
        qr.forEach(doc =>{
            str+=
            `<div class="d-flex mb-4">
                <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." /></div>
                <div class="ms-3">
                    <div class="fw-bold">Commenter Name</div>
                    ${doc.data().comment_content}
                </div>
            </div>`
        })
        document.getElementById('comment-section').innerHTML=str;
    })
}
