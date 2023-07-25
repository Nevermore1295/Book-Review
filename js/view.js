
import { auth } from "./index.js";
import { component } from "./component.js";
import { controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";



export let view = {};

//Set view
view.setScreen = (screenName, review_id) => {
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
            document.getElementById('app').innerHTML = component.navbar() + component.reviewContent() + component.footer();
            controller.authChecktotal();
            
            controller.showCurrentReviewDetail(review_id).then(()=>{
                //Load realtime-update comment
                controller.authCheckcommment();
                controller.showComment(review_id);

                document.getElementById('comment').addEventListener('submit', (cf) =>{
                    cf.preventDefault();
    
                    //Add data object to doc
                    controller.addComment(review_id).then(() => {
                        // Reset form
                        document.getElementById('comment').reset();
                        console.log(`User ${auth.currentUser.displayName} successfully comment`); 
                    }).catch(err => {
                        // Catch error
                        console.log(err.message);
                    })                                
                })
            });

            //Set redirect button
            view.setScreenButton('navbar-brand','homeScreen');
            // document.getElementById('navbar-brand').style.cursor = 'pointer';
            // document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));

        break;
        

        case 'registerScreen':
            //Set up HTML
            document.getElementById('app').innerHTML = component.blankNavbar() + component.registerContent() + component.footer();

            const registerForm = document.getElementById('register');
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();

                //Add data object to doc
                controller.register().then(() => {
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

            //Book search bar
            document.getElementById('bookSearchbar').addEventListener('submit', async (j) =>{
                j.preventDefault();
                
                controller.showBook().then(() => {
                    // Reset form
                    document.getElementById('bookSearchbar').reset();

                    //Review Form
                    document.getElementById('Review').addEventListener('submit', (e)=>{
                        e.preventDefault();

                        //Add data object to doc
                        controller.addReview().then(() => {
                            // Reset form
                            document.getElementById('Review').reset();
                        }).catch(err => {
                            // Catch error
                            console.log(err.message)
                        });
                    })
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                });
            });




            //Set redirect button
            view.setScreenButton('navbar-brand','homeScreen');
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



