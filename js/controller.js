import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut ,updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, getDoc, orderBy, onSnapshot, Timestamp, limit, startAt, endAt} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { auth,db } from "./index.js";
import { view } from "./view.js";
import { component } from "./component.js";
import { book } from "./bookfinder.js";

export const controller = {};

//Auth check 
controller.Authentication = async () => {
    auth.onAuthStateChanged(()=>{
        if(auth.currentUser===null){
            document.getElementById('user-auth').innerHTML=component.Authentication(false);
            document.getElementById('review-btn-li').style.display = 'none';
            document.getElementById('admin-btn-li').style.display = 'none';
            document.getElementById('login').addEventListener('submit', (e) => {
                e.preventDefault();
                controller.login();
                document.getElementById('login').reset(); 
            });   

            view.setScreenButton('register','registerScreen');
            // document.getElementById('register').addEventListener('click', () => view.setScreen('registerScreen'));
            // document.getElementById('review-btn-li').style.display = "none";
        
        } else {
            document.getElementById('user-auth').innerHTML=component.Authentication(true);
            document.getElementById('review-btn-li').style.display = 'block';
            controller.isAdmin();
            document.getElementById('log-out').addEventListener('click',()=>{
                controller.logout();
            });
        }
    })
}

controller.isAdmin = async () => {
    // .data().user_authority
    let docRef = await (getDoc(doc(db, "User", auth.currentUser.uid)));
    if (await docRef.data().user_authority==2){
        document.getElementById('admin-btn-li').style.display = 'block';
        document.getElementById('admin-btn-li').innerHTML=`<a id="admin-btn">Administration</a>`
    } else {
        document.getElementById('admin-btn-li').style.display = 'none';
    }
}

//Auth check for comment
controller.showSubmitComment = () => {
    auth.onAuthStateChanged(()=>{
        if (auth.currentUser!==null && view.currentScreen==='reviewDetailScreen') {
            document.getElementById("comment-input").innerHTML = `
            <form class="mb-4 d-flex" id="comment" >
                <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!">
                </input>
                <button class="btn btn-block btn-lg btn-primary" id="comment-btn">
                    Submit
                </button>
            </form>`;
        } else if (auth.currentUser===null && view.currentScreen==='reviewDetailScreen'){
            console.log(document.getElementById("comment"));
            document.getElementById("comment").innerHTML = ``;
        }
    });
}

//Login
controller.login = async () =>{
    //Get user information and create a user data object
    const initialData = {
        email: document.getElementById('email-login').value.trim(),
        password: document.getElementById('password-login').value.trim(),
    }
    
    await signInWithEmailAndPassword(auth, initialData.email, initialData.password).then(user => {
        console.log(`User ${user.user.displayName} successfully logged in`);
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}

//Logout
controller.logout = async () =>{
    await signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    console.log(error.message);
    });
}

//Register
controller.register = async () =>{
    //Get user infor and create data object 
    const initialData = {
        user_name: document.getElementById('username').value.trim(),
        user_email: document.getElementById('email').value.trim(),
        user_password: document.getElementById('password').value.trim(),
        user_authority: 1,                       
    }

    if (initialData.user_name.trim() === '') {
        //Kiểm tra khoảng trống username
        console.log('Missing username');
    } else if (initialData.user_name.trim().length < 6) {
        //Kiểm tra độ dài username
        console.log('Username must be at least 6 characters')
    } else if (initialData.user_password !== document.getElementById('pwconfirmation').value) {
        //Xác nhận mật khẩu
        console.log('Password and password confirmation must be the same')
    } else if (initialData.user_password === document.getElementById('pwconfirmation').value) {
        let exist = false;
        const q = await query(collection(db, 'users'), where('username', '==', initialData.user_name.trim()));
        await getDocs(q).then( async (d) => {
            d.forEach(data => {
                if (data.exists) {
                    exist = true;  
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

//Add review to firestore
controller.addReview = async () =>{   
    //Create data object
    const initialData = {
        review_created_date: Timestamp.now(),
        review_creator_id: auth.currentUser.uid,
        review_title: document.getElementById('Review-title').value.trim(),
        review_content: document.getElementById('Review-content').value.trim(),
        review_book_id: document.getElementById('rv-bid').value,
        // review_id: await getDoc();
        //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
    }

    if (initialData.review_title === '' || initialData.review_content === '') {
        alert('Title and content must not be blank');
    } else {
        await addDoc(collection(db, 'Review'),initialData).then(() => {

        document.getElementById('review-funcscreen').innerHTML = 
        `
            <div class="card mt-3">
                <div class="card-body">
                    <h5>Your review has been saved!</h5>
                    <p><a>Go to homepage</a> or <a>Make another review</a></p>
                </div>
            </div>
        `
        //Reset form
        }).catch(err => {
            // Catch error
            console.log(err.message)
        })
    }
}

//Get review query from firestore
controller.getCurrentReviewQuery = async () => {
    // ,startAt(page*5),endAt((page+1)*5)
    return await (query(collection(db,'Review'),orderBy('review_created_date','desc')));
}

//Get review query from firestore
controller.getCurrentReviewDocs = async () => {
    // ,startAt(page*5),endAt((page+1)*5)
    return await (getDocs(query(collection(db,'Review'),orderBy('review_created_date','desc'),limit(5))));
}

//Show review at Homepage
controller.showCurrentReviewPage = async (data_map,key_array,page) => {

        let current_key = new Array();

        let i = page*5 ;
        while (i<(page+1)*5 && key_array[i]!==undefined){
            current_key.push(key_array[i]);
            i++;
        };

        // for (let i = page*5; i<(page+1)*5;i++){
        //     current_key.push(key_array[i]);
        // }
        console.log(current_key);
        
        //Add view for doc
        document.getElementById('featured-post').innerHTML = component.blogEntries(data_map,current_key);
        

        //Set redirect button
        document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
            element.style.cursor='pointer';
            element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
        });
}

controller.showReviewPage = async () => {
    let review_query = await controller.getCurrentReviewQuery();

    controller.showDefaultReviewPage();

    onSnapshot(review_query,(qr)=>{

        //Define Map variable to store <key,value>
        let data_map = new Map();

        //Define Array variable to store <key>
        let key_array = new Array();

        //Set mapping and push key
        qr.forEach(doc =>{
            data_map.set(doc.id,doc.data());
            key_array.push(doc.id);
        });

        let page = (key_array.length/5)+1;

        document.getElementById('review-page').innerHTML=component.reviewPage(page);

        document.querySelectorAll('.page-item').forEach(item =>{
            item.addEventListener('click',async ()=>{
                document.querySelectorAll('.page-item').forEach (childitem =>{
                    childitem.setAttribute('class','page-item');
                })

                item.setAttribute('class','page-item active');
                controller.showCurrentReviewPage(data_map,key_array,item.getAttribute('value')-1)
            });
        });
   })  
}

controller.showDefaultReviewPage = async () => {
    let review_doc = await controller.getCurrentReviewDocs();
    //Define Map variable to store <key,value>
    let data = new Map();

    //Define Array variable to store <key>
    let key = new Array();
    //Set mapping and push key
    review_doc.forEach(doc =>{
        data.set(doc.id,doc.data());
        key.push(doc.id);
    });
    controller.showCurrentReviewPage(data,key,0);
} 

// Get review doc from firestore
controller.getCurrentReviewDetailDoc = async (review_id) => {

    const docRef = doc(db, "Review", review_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

//Show review detail information at current review page
controller.showCurrentReviewDetail = async (review_id) =>{
    document.getElementById('reviewInfo').innerHTML=component.reviewInfo(await controller.getCurrentReviewDetailDoc(review_id));
    document.getElementById('commentSection').innerHTML=component.commentSection(await controller.getCurrentReviewDetailDoc(review_id));
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


//Add comment to firestore
controller.addComment = async (review_id) =>{

    //Get comment information and create a comment data object  
    const initialData = {
        comment_creator_id: auth.currentUser.uid,
        comment_created_date: Timestamp.now(),
        comment_review_id: review_id,
        comment_parent_id: null,
        comment_content: document.getElementById('comment-content').value.trim(),
    };

    //Add comment data object to firestore and return a Promise
    return await addDoc(collection(db, 'Comment'),initialData).then(() => {
        // Reset form
        document.getElementById('comment').reset();
        console.log(`User ${auth.currentUser.displayName} successfully comment`); 
        document.getElementById('comment-content').disabled = false;
        document.getElementById('comment-btn').disabled = false;      
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}

//Get parent comment query from firestore
controller.getCurrentCommentQuery = async (comment_review_id) => {
    //,where('comment_created_date','!=',null)),orderBy('comment_created_date')
    return await (query(collection(db,'Comment'),and(where('comment_review_id','==',comment_review_id),where('comment_parent_id','==',null))));
}

//Show comment information
controller.showParentComment = async (review_id) =>{
    onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
        let str='';
        qr.forEach(doc =>{
            str+=component.displayedParentComment(doc);         
        });
        document.getElementById('comment-section').innerHTML=str;
    });
}



//Get book information
controller.getBookToReview = async () => {
    return await book.resolveQuery(document.getElementById('bookSearchinput').value.replace(/\s+/g, ''));
}   

//Show book information
controller.showBook = async () => {
    let bookResult = await controller.getBookToReview();
    document.getElementById('bookSearchList').innerHTML +=
    `<div class="card-body overflow-auto" style="max-height: 300px">
        <div id="bookSearchoutput"></div>
    </div>`;

    document.getElementById('bookSearchoutput').innerHTML=component.bookSearchoutput(bookResult); 
    document.querySelectorAll(".rv-btn").forEach(e=>{
        e.addEventListener("click", (j) => {
            document.getElementById('rv-title').value = bookResult[j.target.id].title;
            document.getElementById('rv-authors').value = bookResult[j.target.id].authors;
            document.getElementById('rv-pd').value = bookResult[j.target.id].publishedDate;
            document.getElementById('rv-thumbnail').src = component.imageCheck(bookResult[j.target.id].imageLinks);
            document.getElementById('rv-bid').value = bookResult[j.target.id].id;;
            document.querySelectorAll('.review-forminput').forEach(e=>{ 
                e.disabled = false;
            })
        })
    });
}


controller.getReviewDocs = async () => {
    return await getDocs(collection(db, 'Review'));
}

controller.getCommentDocs = async () => {
    return await getDocs(collection(db, 'Review'));
}
