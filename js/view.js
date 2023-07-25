
import { auth } from "./index.js";
import { component } from "./component.js";
import { controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";



export let view = {};

//Thay đổi giao diện
view.setScreen = async (screenName, review_id) => {
    switch (screenName){
        case 'homeScreen':
            //Set up HTML
            document.getElementById('app').innerHTML = component.navbar() + component.header() + component.homeContent() + component.footer();
            controller.authChecktotal();

            //Show review
            controller.showReview();
    
            //Set redirect button
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('review-btn').style.cursor = 'pointer';
            document.getElementById('review-btn').addEventListener('click', () => view.setScreen('reviewCreatorScreen'));
            document.getElementById('search-btn').style.cursor = 'pointer';
            document.getElementById('search-btn').addEventListener('click', () => view.setScreen('searchScreen'));
            break;


        case 'reviewDetailScreen':
             //Set up HTML
            document.getElementById('app').innerHTML = component.navbar() + component.reviewContent(await controller.getCurrentReviewDoc(review_id)) + component.footer();
            controller.authChecktotal();
            
            //Load realtime-update comment
            controller.showComment(review_id);
            controller.authCheckcommment();

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
                    comment_parent_id: null,
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

                //Get user infor and create data object 
                const initialData = {
                    user_name: document.getElementById('username').value.trim(),
                    user_email: document.getElementById('email').value.trim(),
                    user_password: document.getElementById('password').value.trim(),
                    user_authority: 1,                       
                }

                //Add data object to doc
                controller.register(initialData, document.getElementById('pwconfirmation').value).then(() => {
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

            let bookIdSelected = '';

            //Book search bar
            document.getElementById('bookSearchbar').addEventListener('submit', async (j) =>{
                j.preventDefault();
                await controller.showBook().then(() => {
                    // Reset form
                    document.getElementById('bookSearchbar').reset();
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                });
            });


            //Review Form
            document.getElementById('Review').addEventListener('submit', (e)=>{
                e.preventDefault();
                console.log(bookIdSelected);

                //Create data object
                const initialData = {
                    review_created_date: Timestamp.now(),
                    review_creator_id: auth.currentUser.uid,
                    review_title: document.getElementById('Review-title').value.trim(),
                    review_content: document.getElementById('Review-content').value.trim(),
                    review_book_isbn: bookIdSelected,
                    //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
                }
                //Add data object to doc
                controller.addReview(initialData).then(() => {
                    // Reset form
                    document.getElementById('Review').reset();
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                });
            })

            //Set redirect button
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            break;

        case 'searchScreen':
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

view.setScreenButton = (button_id,screen_name) => {
    document.getElementById(button_id).style.cursor = 'pointer';
    document.getElementById(button_id).addEventListener('click', () => view.setScreen(screen_name));
}


view.setScreen('reviewCreatorScreen');



