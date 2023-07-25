import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut ,updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, getDoc, orderBy, onSnapshot, Timestamp, limit} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { auth,db } from "./index.js";
import { view } from "./view.js";
import { component } from "./component.js";
import { book } from "./bookfinder.js";

export const controller = {};

controller.authChecktotal = () => {
    auth.onAuthStateChanged(()=>{
        if(auth.currentUser===null){
            console.log(document.getElementById('user-auth'));
            document.getElementById('user-auth').innerHTML=component.navbarLoginForm();
            const loginForm = document.getElementById('login');
            loginForm.addEventListener('submit', (e) => {
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
            });   
            document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen'));
            document.getElementById('review-btn-li').style.display = "none";
        } else {
            console.log(document.getElementById('user-auth'));
            document.getElementById('user-auth').innerHTML=component.navbarUsername();
            document.getElementById('review-btn-li').style.display = 'block';
            
            const logOutButton = document.getElementById('log-out');
            logOutButton.addEventListener('click',()=>{
                controller.logout();
            });
        }
    })
}

controller.authCheckcommment = () =>{
    auth.onAuthStateChanged(() => {
        if (auth.currentUser!==null) {
        document.getElementById("comment").innerHTML = `<form class="mb-4 d-flex" id="comment" >
        <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!">
        </input>
        <button class="btn btn-block btn-lg btn-primary">
            Submit
        </button>
    </form>`;
    }
    else {
        document.getElementById("comment").innerHTML = ``;
    }
    });
}


controller.login = async (initialData) =>{
    await signInWithEmailAndPassword(auth, initialData.email, initialData.password).then(user => {
        console.log(`User ${user.user.displayName} successfully logged in`);
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}

controller.logout = async () =>{
    await signOut(auth).then(() => {
    view.setScreen('homeScreen');
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    console.log(error.message);
    });
}

controller.register = async (initialData,pwcf) =>{
    if (initialData.user_name.trim() === '') {
        console.log('Missing username');
    } else if (initialData.user_name.trim().length < 6) {
        console.log('Username must be at least 6 characters')
    } else if (initialData.user_password !== pwcf) {
        console.log('Password and password confirmation must be the same')
    } else if (initialData.user_password === pwcf) {
        let exist = false;
        const q = await query(collection(db, 'users'), where('username', '==', initialData.user_name.trim()));
        await getDocs(q).then( async (d) => {
            d.forEach(data => {
                if (data.exists) {
                    exist = true;  //
                }
            })
            if (!exist) {
                await createUserWithEmailAndPassword(auth, initialData.user_email, initialData.user_password).then(cred => {
                    // Create data firestore
                    const docRef = doc(db, 'User', cred.user.uid)
                    setDoc(docRef, initialData, { merge: false })
                    console.log(`User ${initialData.user_name} successfully registered`)
                    updateProfile(auth.currentUser, {displayName: initialData.user_name,})
                }).catch(err => {
                    // Catch error
                    console.log(err.message)
                })
            } else {
                console.log("This username has already been taken")
            }
        })
    }
}

//Thêm comment vào firestore
controller.addComment = async (initialData) =>{
    return await addDoc(collection(db, 'Comment'),initialData);
}

controller.getCurrentReviewDoc = async (review_id) => {

    const docRef = doc(db, "Review", review_id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}


//Lấy query của review từ firestore
controller.getCurrentReviewQuery = async () => {
    return await (query(collection(db,'Review'),orderBy('review_created_date'),limit(5)));
}

//Hiển thị review
controller.showReview = async () => {
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

//Thêm review vào firestore
controller.addReview = async (initialData) =>{
    await addDoc(collection(db, 'Review'),initialData).then(() => {
        //Reset form
    }).catch(err => {
        // Catch error
        console.log(err.message)
    })
}
            
controller.addReview = () =>{
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
                    review_book_id: document.getElementById('rv-bid').value
                    //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
                }

                if (reviewTitle === '' || reviewContent === '') {
                    alert('Title and content must not be blank');
                } else
                {
                    //Add data object to doc
                    addDoc(collection(db, 'Review'),initialData).then(() => {
                    //Reset form
                    document.getElementById('review-funcscreen').innerHTML = 
                    `
                        <div class="card mt-3">
                            <div class="card-body">
                                <h5>Your review has been saved!</h5>
                                <p><a>Go to homepage</a> or <a>Make another review</a></p>
                            </div>
                        </div>
    
                    `
                    }).catch(err => {
                        // Catch error
                        console.log(err.message)
                    })
                }
            })
}


// controller.getComment = async (review_id) =>{
//     onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
//         let value = new Array();
//         qr.forEach(doc =>{
//             console.log(doc.data());
//             value.push(doc.data());
//         })
//         console.log(value);
//     })
// }

//Lấy query của parent comment từ firestore
controller.getCurrentCommentQuery = async (comment_review_id) => {
    return await (query(collection(db,'Comment'),and(where('comment_review_id','==',comment_review_id),where('comment_parent_id','==',null)),limit(6)));
}

//Hiển thị comment
controller.showComment = async (review_id) =>{
    onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
        let str='';
        qr.forEach(doc =>{
            console.log(doc.data());
            str+=component.displayedParentComment(doc);         
        });
        document.getElementById('comment-section').innerHTML=str;
    });
}



//Lấy infor sách
controller.getBookToReview = async () => {
    return await book.resolveQuery(document.getElementById('bookSearchinput').value.replace(/\s+/g, ''));
}   

//Hiển thị sách
controller.showBook = async () => {
    let bookIdSelected = ''

    let bookResult = await controller.getBookToReview();
    document.getElementById('bookSearchList').innerHTML +=
    `<div class="card-body overflow-auto bg-white" style="max-height: 300px">
        <div id="bookSearchoutput"></div>
    </div>`;

    document.getElementById('bookSearchoutput').innerHTML=component.bookSearchoutput(bookResult); 
    document.querySelectorAll(".rv-btn").forEach(e=>{
        e.addEventListener("click", (j) => {
            document.getElementById('rv-title').value = bookResult[j.target.id].title;
            document.getElementById('rv-authors').value = bookResult[j.target.id].authors;
            document.getElementById('rv-pd').value = bookResult[j.target.id].publishedDate;
            document.getElementById('rv-thumbnail').src = component.imageCheck(bookResult[j.target.id].imageLinks);
            bookIdSelected = bookResult[j.target.id].id;  
            document.getElementById('rv-bid').value = bookResult[j.target.id].id;;
            document.querySelectorAll('.review-forminput').forEach(e=>{ 
                e.disabled = false;
            })
        })
    });
}


controller.getReviewQuery = async () => {
    return await (query(collection(db, 'Review')));
}