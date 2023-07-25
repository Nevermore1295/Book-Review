
import { auth } from "./index.js";
import { component } from "./component.js";
import { controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";



export let view = {};

view.showReview = async () => {
    onSnapshot(await controller.getCurrentReviewQuery(),(qr)=>{
        let str = '';
        //Define Map variable to store <key,value>
        let data = new Map;

        //Define Array variable to store <key>
        let key = new Array;

        //Set mapping and push key
        qr.forEach(doc =>{
            data.set(doc.id,doc.data());
            key.push(doc.id);
        })

        //Add view for doc
        document.getElementById('featured-post').innerHTML = component.blogEntries(data,key);

        //Set redirect button
        document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
            element.style.cursor='pointer';
            element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
        });
        
        },(err)=>{
            console.log(err);
            console.log(err.message);
        }
    );
}

//Thay đổi giao diện
view.setScreen = async (screenName, review_id) => {
    switch (screenName){
        case 'homeScreen':
            //Set up HTML
            document.getElementById('app').innerHTML = component.navbar() + component.header() + component.homeContent() + component.footer();
            controller.authCheck();

            view.showReview();
               

            //Set redirect button
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('review-btn').style.cursor = 'pointer';
            document.getElementById('review-btn').addEventListener('click', () => view.setScreen('reviewCreatorScreen'));
            document.getElementById('search-btn').style.cursor = 'pointer';
            document.getElementById('search-btn').addEventListener('click', () => view.setScreen('search'));

            break;


        case 'reviewDetailScreen':
             //Set up HTML
            document.getElementById('app').innerHTML = component.navbar() + component.reviewContent(await controller.getCurrentReviewDoc(review_id)) + component.footer();
            controller.authCheck();
            
            //Load realtime-update comment
            controller.showComment(review_id);

            const commentForm = document.getElementById('comment');
            commentForm.addEventListener('submit', (cf) =>{
                cf.preventDefault();
                //Get comment content
                const commentContent = document.getElementById('comment-content').value;

                //Create data object     
                const initialData = {
                    comment_creator_id: auth.currentUser.uid,
                    comment_created_date: Timestamp.now(),
                    comment_review_id: review_id,
                    comment_parent_id:null,
                    comment_content: commentContent.trim(),
                }

                //Add data object to doc
                controller.addComment(initialData).then(() => {
                // Reset form
                commentForm.reset();
                console.log(`User ${auth.currentUser.displayName} successfully comment`); 
                }).catch(err => {
                    // Catch error
                    console.log(err.message);
                })                                
            })

            //Set redirect button
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));

        break;
        

        case 'registerScreen':
            //Set up HTML
            document.getElementById('app').innerHTML = component.blankNavbar() + component.registerContent() + component.footer();

            const registerForm = document.getElementById('register');
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
            
                //Get user info
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const pwcf = document.getElementById('pwconfirmation').value; 

                //Create data object 
                const initialData = {
                    user_name: username.trim(),
                    user_email: email.trim(),
                    user_password: password.trim(),
                    user_authority: 1,                       
                }

                //Add data object to doc
                controller.register(initialData, pwcf).then(() => {
                    // Reset form
                    registerForm.reset();
                    view.setScreen('homeScreen');
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                });
                //Register user

            })
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
        break;

        case 'reviewCreatorScreen':
            //Set up HTML 
            document.getElementById('app').innerHTML = component.navbar() + component.bookSearch() + component.footer();
            const bookinfo = document.getElementById('bookSearchbar');
            bookinfo.addEventListener('submit', (j) =>{
                j.preventDefault();
                controller.getBookToReview(); 
                bookinfo.reset() 
            });

            const ReviewForm = document.getElementById('Review');
            ReviewForm.addEventListener('submit', (e)=>{
                e.preventDefault();

                //Get review data 
                const reviewTitle = document.getElementById('Review-title').value;
                const reviewContent = document.getElementById('Review-content').value;

                //Create data object
                const initialData = {
                    review_created_date: Timestamp.now(),
                    review_creator_id: auth.currentUser.uid,
                    review_title: reviewTitle.trim(),
                    review_content: reviewContent.trim(),
                    review_book_id: bookIdSelected
                    //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
                }

                //Add data object to doc
                controller.addReview(initialData).then(() => {
                //Reset form
                
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
            })
            

            //Set redirect button
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            break;

        case 'search':
             //Set redirect button
            document.getElementById('app').innerHTML = component.navbar() + component.reviewQuery() + component.footer();
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
        break;
        
        default:
            view.setScreen('homeScreen');
        break;

    }
}



view.setScreen();



