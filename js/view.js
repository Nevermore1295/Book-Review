import { component } from "./component.js";
import { auth, db , controller } from "./controller.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, onSnapshot, orderBy, Timestamp} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { book } from "./bookfinder.js";


let view = {};

view.showReview = async () => {
    onSnapshot(await controller.getCurrentReviewQuery(),(qr)=>{
        let str = '';
        let value = new Map;
        let key = new Array;
        qr.forEach(doc =>{
            value.set(doc.id,doc.data());
            key.push(doc.id);
        })
        document.getElementById('featured-post').innerHTML = `
        <div class="card mb-4">
            <a class="reviewScreen" value="${key[0]}"><img class="card-img-top" src="https://dummyimage.com/850x350/dee2e6/6c757d.jpg" alt="..." /></a>
            <div class="card-body">
                <div class="small text-muted">${value.get(key[0]).review_created_date.toDate()}</div>
                <div class="small text-muted">${value.get(key[0]).review_creator_id}</div>
                <h2 class="card-title">${value.get(key[0]).review_title}</h2>
                <p class="card-text overflow-hidden">${value.get(key[0]).review_content}</p>
                <a class="btn btn-primary review-show" value="${key[0]}">Read more →</a>
            </div>
        </div> 
        `
        for (let pos = 1; pos < key.length; pos++){
            document.getElementById('review-posts').innerHTML +=`
                <div class="col-lg-6">
                    <div class="card mb-4">
                        <a class="reviewScreen" value="${key[pos]}"><img class="card-img-top" src="https://dummyimage.com/700x350/dee2e6/6c757d.jpg" alt="..." /></a>
                        <div class="card-body">
                            <div class="small text-muted">${(value.get(key[pos]).review_created_date.toDate())}</div>
                            <h2 class="card-title h4">${value.get(key[pos]).review_title}</h2>
                            <p class="card-text overflow-hidden" style="height: 100px">${value.get(key[pos]).review_content}</p>
                            <a class="btn btn-primary review-show" value="${key[pos]}">Read more →</a>
                        </div>
                    </div>
                </div>
           `
        }
        document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
            element.style.cursor='pointer';
            element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
        })
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

view.showCurrentReview = async (review_id)=>{
    return (await controller.getCurrentReviewDoc(review_id));
}

//Thay đổi giao diện
view.setScreen = async(screenName, type) => {
    switch (screenName){
        case 'homeScreen':
            document.getElementById('app').innerHTML = component.navbar() + component.header() + component.homeContent() + component.footer();
            controller.authCheck();
            view.showReview();
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            document.getElementById('review-btn').style.cursor = 'pointer';
            document.getElementById('review-btn').addEventListener('click', () => view.setScreen('review'));
            document.getElementById('search-btn').style.cursor = 'pointer';
            document.getElementById('search-btn').addEventListener('click', () => view.setScreen('search'));
         
            break;


        case 'reviewDetailScreen':
            document.getElementById('app').innerHTML = component.navbar() + component.reviewContent(await view.showCurrentReview(type)) + component.footer();
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
            document.getElementById('app').innerHTML = component.blankNavbar() + component.registerContent() + component.footer();

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
            document.getElementById('app').innerHTML = component.navbar() + component.bookSearch() + component.footer();
            const bookinfo = document.getElementById('bookSearchbar');
            let bookIdSelected ='';
            bookinfo.addEventListener('submit', async (j) => {
                j.preventDefault();
                let bookResult = await book.resolveQuery(document.getElementById('bookSearchinput').value.replace(/\s+/g, ''));
                console.log(bookResult);
                document.getElementById('bookSearchList').innerHTML +=`<div class="card-body overflow-auto bg-white" style="max-height: 300px">
                    <div id="bookSearchoutput"></div>
                </div>`;
                
                let str = '';
                for (let index = 0; index < bookResult.length; index++) {    
                      str +=
                      `
                    <div class="card bg-light m-2">
                        <form class="card-body d-flex justify-content-between">
                            <div class="d-flex">
                                <img class="mt-1" src="
                                ${imageCheck(bookResult[index].imageLinks)}" height="100" width="70">
                                <div class="resultBasic ms-3">
                                    <h5>${bookResult[index].title}</h5>
                                    <p>Author: ${bookResult[index].authors}</p>
                                    <p>Date published: ${bookResult[index].publishedDate}</;>
                                </div>
                            </div>   
                            <button style="height:40px" id="${index}" class="rv-btn btn btn-outline-primary mt-2" type="button">Review</button>
                        </form>
                    </div>
                      `;
                }
                
                document.getElementById('bookSearchoutput').innerHTML=str; 
                document.querySelectorAll(".rv-btn").forEach(e=>{
                    e.addEventListener("click", (j) => {
                        document.getElementById('rv-title').value = bookResult[j.target.id].title;
                        document.getElementById('rv-authors').value = bookResult[j.target.id].authors;
                        document.getElementById('rv-pd').value = bookResult[j.target.id].publishedDate;
                        bookIdSelected = bookResult[j.target.id].id;
                    })
                })

                
                bookinfo.reset();  
            })   

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
                    review_book_id: bookIdSelected
                    //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
                }

                //Add data to doc
                controller.addReview(initialData).then(() => {
                // Reset form
                
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
            })
            
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
            break;

        case 'search':
            document.getElementById('app').innerHTML = component.navbar() + component.reviewQuery() + component.footer();
            document.getElementById('navbar-brand').style.cursor = 'pointer';
            document.getElementById('navbar-brand').addEventListener('click', () => view.setScreen('homeScreen'));
        break;
        
        default:
            view.setScreen('homeScreen');
        break;

    }
}

let imageCheck = (index) => {
    if ( index === undefined) {
        return "../assets/Question_mark_(black).png";
    }else
    {
        return index.thumbnail;
    };
}


view.setScreen('review');



