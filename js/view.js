import { component } from "./component.js";
import { auth, db , controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";



let view = {};

view.showReview = async () => {
    await onSnapshot(await controller.getCurrentReviewQuery(),(qr)=>{
        console.log(qr);
        let str = '';
        let value = new Map;
        let key = new Array;
        qr.forEach(doc =>{
            value.set(doc.id,doc.data());
            key.push(doc.id);
        })
        str+=`
        <!-- Featured blog post-->
        <div class="card mb-4">
            <a class="reviewScreen" value="${key[0]}"><img class="card-img-top" src="https://dummyimage.com/850x350/dee2e6/6c757d.jpg" alt="..." /></a>
            <div class="card-body">
                <div class="small text-muted">${value.get(key[0]).review_created_date}</div>
                <div class="small text-muted">${value.get(key[0]).review_creator_id}</div>
                <h2 class="card-title">${value.get(key[0]).review_title}</h2>
                <p class="card-text">${value.get(key[0]).review_content}</p>
                <a class="btn btn-primary" class="reviewScreen" value="${key[0]}">Read more →</a>
            </div>
        </div> 
        `

        str+=`
        <!-- Nested row for non-featured blog posts-->
        <div class="row">
            <div class="col-lg-6">
                <!-- Blog post-->
                <div class="card mb-4">
                    <a class="reviewScreen" value="${key[1]}"><img class="card-img-top" src="https://dummyimage.com/700x350/dee2e6/6c757d.jpg" alt="..." /></a>
                    <div class="card-body">
                        <div class="small text-muted">${(value.get(key[1]).review_created_date.ToDateTime())}</div>
                        <h2 class="card-title h4">${value.get(key[1]).review_title}</h2>
                        <p class="card-text">${value.get(key[1]).review_content}</p>
                        <a class="btn btn-primary" class="reviewScreen" value="${key[1]}">Read more →</a>
                    </div>
                </div>
                <!-- Blog post-->
                <div class="card mb-4">
                    <a class="reviewScreen"><img class="card-img-top" src="https://dummyimage.com/700x350/dee2e6/6c757d.jpg" alt="..." /></a>
                    <div class="card-body">
                        <div class="small text-muted">January 1, 2023</div>
                        <h2 class="card-title h4">Post Title</h2>
                        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis aliquid atque, nulla.</p>
                        <a class="btn btn-primary" class="reviewScreen">Read more →</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <!-- Blog post-->
                <div class="card mb-4">
                    <a class="reviewScreen"><img class="card-img-top" src="https://dummyimage.com/700x350/dee2e6/6c757d.jpg" alt="..." /></a>
                    <div class="card-body">
                        <div class="small text-muted">January 1, 2023</div>
                        <h2 class="card-title h4">Post Title</h2>
                        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis aliquid atque, nulla.</p>
                        <a class="btn btn-primary" class="reviewScreen">Read more →</a>
                    </div>
                </div>
                <!-- Blog post-->
                <div class="card mb-4">
                    <a class="reviewScreen"><img class="card-img-top" src="https://dummyimage.com/700x350/dee2e6/6c757d.jpg" alt="..." /></a>
                    <div class="card-body">
                        <div class="small text-muted">January 1, 2023</div>
                        <h2 class="card-title h4">Post Title</h2>
                        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis aliquid atque, nulla? Quos cum ex quis soluta, a laboriosam.</p>
                        <a class="btn btn-primary" class="reviewScreen">Read more →</a>
                    </div>
                </div>
            </div>
        </div>
        `
        document.getElementById('blog-entries').innerHTML = str;
    },(err)=>{
        console.log(err);
        console.log(err.message);
    })
 
}

view.showComment = async (review_id) =>{
    onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
        let str = '';
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


//Thay đổi giao diện
view.setScreen = (screenName, type) => {
    switch (screenName){
        case 'homeScreen':
            document.getElementById('app').innerHTML = component.navbar + component.header + component.homeContent + component.footer;
            
            controller.authCheck();

            view.showReview();
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('review-btn').style.cursor = 'pointer';
            document.getElementById('review-btn').addEventListener('click', () => view.setScreen('review'));
            document.getElementById('search-btn').style.cursor = 'pointer';
            document.getElementById('search-btn').addEventListener('click', () => view.setScreen('search'));
            document.querySelectorAll('.reviewScreen').forEach(element=>{
                element.style.cursor='pointer';
                element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
            })
            break;


        case 'reviewDetailScreen':
            document.getElementById('app').innerHTML = component.navbar + component.reviewContent + component.footer;
            
            controller.authCheck();
            
            //Load realtime-update comment
            view.showComment(type);

            const commentForm = document.getElementById('comment');
            commentForm.addEventListener('submit', (cf) =>{
                cf.preventDefault();
                // Get comment content
                const commentContent = document.getElementById('comment-content').value;

                //Create data firestore      
                const initialData = {
                    comment_creator_id: auth.currentUser.uid,
                    comment_created_date: Timestamp.now(),
                    comment_review_id: type,
                    comment_parent_id:null,
                    comment_content: commentContent.trim(),
                }

                //Add data to doc
                controller.addComment(initialData).then(() => {
                // Reset form
                commentForm.reset();
                console.log(`User ${auth.currentUser.displayName} successfully comment`); 
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
                           
                    
            })

            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
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

                // Register user
                if (username.trim() === '') {
                    console.log('Missing username')
                } else if (username.trim().length < 6) {
                    console.log('Username must be at least 6 characters')
                } else if (password !== pwcf) {
                    console.log('Password and password confirmation must be the same')
                } else if (password === pwcf) {

                    const initialData = {
                        user_name: username.trim(),
                        user_email: email.trim(),
                        user_password: password.trim(),
                        user_authority: 1,                       
                    }

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
            document.getElementById('app').innerHTML = component.navbar + component.bookSearch + component.footer;
            
            const ReviewForm = document.getElementById('Review');
            ReviewForm.addEventListener('submit', (e)=>{
                e.preventDefault();

                const reviewTitle = document.getElementById('Review-title').value;
                const reviewContent = document.getElementById('Review-content').value;
                const initialData = {
                    review_created_date: Timestamp.now(),
                    review_creator_id: auth.currentUser.uid,
                    review_title: reviewTitle.trim(),
                    review_content: reviewContent.trim(),
                }

                //Add data to doc
                controller.addReview(initialData).then(() => {
                // Reset form
                ReviewForm.reset();

                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
            })
            
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            break;

        case 'search':
            document.getElementById('app').innerHTML = component.navbar + component.reviewQuery + component.footer;
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
        break;
        
        default:
            view.setScreen('homeScreen');
        break;

    }
}

view.setScreen();



