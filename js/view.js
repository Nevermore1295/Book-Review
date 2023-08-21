
import { auth } from "./index.js";
import { component } from "./component.js";
import { controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


export let view = {};

//Get current view
view.currentScreen = '';

//Set view
view.setScreen = async (screenName, review_id, collection_value) => {
    switch (screenName){
        case 'homeScreen':
            view.currentScreen='homeScreen';
            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.navbar() + component.header() + component.homeContent() + component.footer();
            controller.Authentication();
            //Show review
            controller.showReviewList();
            controller.searchReview();
            controller.showAuthorSetting();
            
            //Set redirect button
            view.setSearchScreenByCollection();
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');;
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');
            
            break;


        case 'reviewDetailScreen':
            view.currentScreen='reviewDetailScreen';

            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.navbar() + component.reviewContent() + component.footer();
            //Xác minh user hiện tại
            controller.Authentication();
            controller.showCurrentReviewDetail(review_id).then(()=>{
                //Show comment bar and button
                controller.commentAuthCheck(review_id);
            });

            //Set redirect button
            view.setSearchScreenByCollection();
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');;
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');;

        break;
        

        case 'registerScreen':
            view.currentScreen='registerScreen';

            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.blankNavbar() + component.registerContent() + component.footer();
            //Create an account
            document.getElementById('register').addEventListener('submit', (e) => {
                e.preventDefault();
                //Add data object to doc
                controller.register();
            });
            //Nút login quay lại Homescreen
            view.setScreenButtonByID('navbar-brand','homeScreen');
            document.getElementById('login-btn').style.cursor = 'pointer';
            document.getElementById('login-btn').addEventListener('click', async () => { 
                await view.setScreen('homeScreen'); 
                document.getElementById('login-modal').click()
            });
        break;

        case 'reviewCreatorScreen':
            view.currentScreen='reviewCreatorScreen';
            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.navbar() + component.bookSearchContent() + component.footer();
            //Xác minh user hiện tại
            controller.Authentication();

            //Book search bar
            document.getElementById('bookSearchbar').addEventListener('submit', (j) =>{
                j.preventDefault();
                controller.showBook().then(() => {
                    // Reset form
                    document.getElementById('bookSearchbar').reset();
                    //Review Form
                    
                })
            });
            document.getElementById('Review').addEventListener('submit', (e)=>{
                e.preventDefault();
                //Add data object to doc 
                controller.addReview();
               
            })
            //Set redirect button
            view.setSearchScreenByCollection();
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');;
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');

            break;

        case 'searchScreen':
            view.currentScreen='searchScreen';
             //Set redirect button
            document.getElementById('app').innerHTML = component.navbar() + component.reviewSearchScreen() + component.footer();
            //Xác minh user hiện tại
            controller.Authentication();
            //Tìm kiếm review
            controller.searchReview(collection_value);

            view.setSearchScreenByCollection();
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');;
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');

        break;

        case 'reviewEditorScreen':
            view.currentScreen='reviewEditor';
            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.navbar() + component.reviewEditor(review_id) + component.footer();
            //Xác minh user hiện tại
            controller.Authentication();
            //Lấy info của review hiện tại để edit
            controller.setEditorInfo(review_id);

            view.setSearchScreenByCollection();
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');
        break;

        case 'userReviewScreen':
            view.currentScreen='userReviewScreen';
            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.navbar() + component.userReview() + component.footer();
            //Xác minh user hiện tại
            controller.Authentication();
            controller.showUserReviews();

            view.setSearchScreenByCollection();
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');
            //Xuất các bài review thuộc sở hữu của user hiện tại
            controller.showUserReviews();
        break;
        
        case 'adminScreen':
            view.currentScreen='adminScreen';
            //Khởi tạo component HTML
            document.getElementById('app').innerHTML = component.navbar() + component.adminScreen() + component.footer();
            //Xác minh user hiện tại
            controller.Authentication();
            controller.showPendingReviews();
            controller.showReviewList();

            view.setSearchScreenByCollection();
            view.setScreenButtonByID('home-btn','homeScreen');
            view.setScreenButtonByID('navbar-brand','homeScreen');
            view.setScreenButtonByID('search-btn','searchScreen');
            view.setScreenButtonByID('review-btn','reviewCreatorScreen');
            //Xuất review ở trạng thái pending
            controller.showPendingReviews();
            //Xuất review ở trạng thái active
            controller.showReviewList();
        break;

        default:
            view.setScreen('homeScreen');
        break;

    }
}
//Gán chuyển hướng cho nút theo ID
view.setScreenButtonByID = (button_id, screen_name, review_id, collection_value) => {
       
    let button_id_str = '#'+button_id;
    document.getElementById(button_id).style.cursor = 'pointer';
    document.getElementById(button_id).addEventListener('click', () => {
        view.setScreen(screen_name,review_id,collection_value);
    });
}
//Gán chuyển hướng cho nút theo Class
view.setScreenButtonByClassName = (button_class_name, screen_name, review_id, collection_value) => {
    let button_class_name_str = '.'+button_class_name;
    document.querySelectorAll(button_class_name_str).forEach((ele)=>{
        ele.style.cursor = 'pointer';
        ele.addEventListener('click', () => {
            view.setScreen(screen_name,review_id,collection_value);
        });
    })
}

view.setSearchScreenByCollection = ()=>{
    view.setScreenButtonByClassName('collection-1','searchScreen','','Action & Adventure');
    view.setScreenButtonByClassName('collection-2','searchScreen','','Biographies/religion');
    view.setScreenButtonByClassName('collection-3','searchScreen','','Business');
    view.setScreenButtonByClassName('collection-4','searchScreen','','Comics');
    view.setScreenButtonByClassName('collection-5','searchScreen','','Education');
    view.setScreenButtonByClassName('collection-6','searchScreen','','Entertainment');
    view.setScreenButtonByClassName('collection-7','searchScreen','','History');
    view.setScreenButtonByClassName('collection-8','searchScreen','','Medical/lifestyle');
    view.setScreenButtonByClassName('collection-9','searchScreen','','Literature & fiction');
    view.setScreenButtonByClassName('collection-10','searchScreen','','Science & technology');
    view.setScreenButtonByClassName('collection-11','searchScreen','','Sport');
    view.setScreenButtonByClassName('collection-12','searchScreen','','Others');
}

view.setScreen();



