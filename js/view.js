
import { auth } from "./index.js";
import { component } from "./component.js";
import { controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


export let view = {};

//Get current view
view.currentScreen = '';

//Set view
view.setScreen = async (screenName, review_id) => {
    switch (screenName){
        case 'homeScreen':
            view.currentScreen='homeScreen';
            //Set up HTML
            document.getElementById('app').innerHTML = component.navbar() + component.header() + component.homeContent() + component.footer();
            controller.Authentication();
            console.log(auth.currentUser)
            //Show review
            controller.showReviewPage();
            //Set redirect button
            view.setScreenButton('navbar-brand','homeScreen');
            view.setScreenButton('review-btn','reviewCreatorScreen');
            view.setScreenButton('search-btn','searchScreen');

            break;

        case 'reviewDetailScreen':
            view.currentScreen='reviewDetailScreen';

             //Set up HTML
            document.getElementById('app').innerHTML = component.navbar() + component.reviewContent() + component.footer();
            controller.Authentication();
            
            controller.showCurrentReviewDetail(review_id).then(()=>{
                
                //Show comment bar and button
                controller.showCommentInput().then(()=>{
                    document.getElementById('comment-input').addEventListener('submit', (cf) =>{
                        cf.preventDefault();
                        //Add data object to doc
                        document.getElementById('comment-content').disabled = true; //prevent creating multiple comment from multi-clicking
                        document.getElementById('comment-btn').disabled = true;      
                        controller.addComment(review_id); 
                                   
                    })
                });

                //Load realtime-update comment
                controller.showParentComment(review_id);
            });

            //Set redirect button
            view.setScreenButton('navbar-brand','homeScreen');
            // document.getElementById('navbar-brand').style.cursor = 'pointer';
            // document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));

        break;
        

        case 'registerScreen':
            view.currentScreen='registerScreen';

            //Set up HTML
            document.getElementById('app').innerHTML = component.blankNavbar() + component.registerContent() + component.footer();

            document.getElementById('register').addEventListener('submit', (e) => {
                e.preventDefault();

                //Add data object to doc
                controller.register().then(() => {
                    // Reset form
                    view.setScreen('homeScreen');
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                });
                //Register user

            });

            view.setScreenButton('navbar-brand','homeScreen');
            document.getElementById('login-btn').style.cursor = 'pointer';
            document.getElementById('login-btn').addEventListener('click', async () => { await view.setScreen('homeScreen'); document.getElementById('login-modal').click()});
           
        break;

        case 'reviewCreatorScreen':
            view.currentScreen='reviewCreatorScreen';
            //Set up HTML 
            document.getElementById('app').innerHTML = component.navbar() + component.bookSearchContent() + component.footer();

            controller.Authentication();
            console.log(await controller.Authentication());

            //Book search bar
            document.getElementById('bookSearchbar').addEventListener('submit', (j) =>{
                j.preventDefault();
                
                controller.showBook().then(() => {
                    // Reset form
                    document.getElementById('bookSearchbar').reset();

                    //Review Form
                    document.getElementById('Review').addEventListener('submit', (e)=>{
                        e.preventDefault();
                        //Add data object to doc
                        controller.addReview();
                    })
                })
            });

            //Set redirect button
            view.setScreenButton('navbar-brand','homeScreen');
            break;

        case 'searchScreen':
            view.currentScreen='searchScreen';
             //Set redirect button
            document.getElementById('app').innerHTML = component.navbar() + component.reviewQuery() + component.footer();
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));

        break;
        
        case 'adminScreen':
            view.currentScreen='adminScreen';
            document.getElementById('app').innerHTML = component.navbar() + component.adminScreen() + component.footer();

            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            controller.showPendingReviews();
        break;

        default:
            view.setScreen('homeScreen');
        break;

    }
}

view.setScreenButton = (button_id, screen_name, screen_event) => {   
    document.getElementById(button_id).style.cursor = 'pointer';
    document.getElementById(button_id).addEventListener('click', () => {
        view.setScreen(screen_name);
        screen_event});
}


view.setScreen('adminScreen');



