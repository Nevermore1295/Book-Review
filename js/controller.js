import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut ,updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, updateDoc, getDocs, getDoc, orderBy, onSnapshot, Timestamp, limit, startAt, startAfter, endAt, deleteDoc} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { auth,db } from "./index.js";
import { view } from "./view.js";
import { component } from "./component.js";
import { book } from "./bookfinder.js";

export const controller = {};
////////////////////////////////// AUTHENCIATOR ///////////////////////////////////////
//Auth check 
controller.Authentication = async () => {
    auth.onAuthStateChanged(()=>{
        console.log(auth.currentUser);

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
        
    } else {
        document.getElementById('admin-btn-li').style.display = 'none';
    }
}

//Auth check for comment
controller.showCommentInput = async() => {
    await auth.onAuthStateChanged(()=>{
        console.log("Auth state changed");
        if (auth.currentUser!==null && view.currentScreen==='reviewDetailScreen') {
            document.getElementById("comment-input").style.display = 'block';
        } else if (auth.currentUser===null && view.currentScreen==='reviewDetailScreen'){
            console.log(document.getElementById("comment-input"));
            document.getElementById("comment-input").style.setProperty("display", "none", "important");
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

    console.log(initialData);
    
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
        console.log(`Logged out successfully`);
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
////////////////////////////////// REVIEW ///////////////////////////////////////
//Add review to firestore
controller.addReview = async () =>{   
    //Create data object
    const initialData = {
        review_creator_id: auth.currentUser.uid,
        review_created_date: Timestamp.now(),
        review_title: document.getElementById('Review-title').value.trim(),
        review_content: document.getElementById('Review-content').value.trim(),
        review_category: document.getElementById('rv-category').value,
        review_status: 'pending',
        review_book_id: document.getElementById('rv-bid').value,
        review_book_thumbnail: document.getElementById('rv-thumbnail').src,
        review_book_title: document.getElementById('rv-title').value,
        review_book_pd: document.getElementById('rv-pd').value,
        review_book_authors: document.getElementById('rv-authors').value
        // review_id: await getDoc();
        //https://www.googleapis.com/books/v1/volumes/bVFPAAAAYAAJ
    }

    if (initialData.review_title === '' || initialData.review_content === '') {
        alert('Title and content must not be blank');
    } else if (document.getElementById('rv-category').value === 'Choose...'){
        alert('Please choose one category');
    } else {
        await addDoc(collection(db, 'Review'),initialData).then(() => {

        document.getElementById('review-funcscreen').innerHTML = 
        `
            <div class="card mt-3">
                <div class="card-body">
                    <h4>Your review has been saved!</h4>
                    <p>Go to <a>homepage</a> or <a>Make another review</a></p>
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

controller.updateReviewPage = async () => {
    let review_query = await (query(collection(db,'Review') ,where('review_status','==','active'), orderBy('review_created_date','desc'))); 

    let review_docs = await getDocs(review_query);

    controller.showCurrentReviewPage(review_docs.docs,0).then(()=>{
        onSnapshot(review_query, async (qr)=>{
            console.log(qr.docs);
            // let review_active = await getDocs(collection(db,'Review'), where('review_status','==','active'), orderBy('review_created_date','desc'));
            controller.showReviewPage(await qr.docs);
        })
    }) 
}


//Hiển thị trang
controller.showReviewPage = async (docs) => {

    let page_quantity = Math.trunc((docs.length/5));
    console.log(page_quantity);

    if (docs.length>5 && doc.length%5>0){
        page_quantity++;
        console.log(page_quantity);
    }

    // console.log(page);
    let current_page = 1;
    document.getElementById('review-page').innerHTML=component.pagination(current_page,page_quantity);
    controller.checkPagePosition(docs, current_page, page_quantity);
   
}

//Kiểm tra tra và xử lí chuyển trang
controller.checkPagePosition = (docs, current_page, page_quantity)=>{
    if (current_page===1){
        document.getElementById('previous-page').disabled =true;
    } else {
        document.getElementById('previous-page').disabled =false;
        document.getElementById('previous-page').addEventListener('click', ()=>{
            current_page--;
            controller.showCurrentReviewPage(docs,current_page-1);
            document.getElementById('review-page').innerHTML=component.pagination(current_page,page_quantity);
            controller.checkPagePosition(docs, current_page,page_quantity);
        });
    }

    if (current_page>=page_quantity){
        document.getElementById('next-page').disabled =true;    
    } else {
        document.getElementById('next-page').disabled =false;
        document.getElementById('next-page').addEventListener('click', async ()=>{       
            current_page++;
            controller.showCurrentReviewPage(docs,current_page-1);
            document.getElementById('review-page').innerHTML=component.pagination(current_page,page_quantity);
            controller.checkPagePosition(docs, current_page,page_quantity);
        });
    }
}

//Hiển thị trang hiện tại
controller.showCurrentReviewPage = async (review_docs,page_number) => {

    console.log(review_docs);
    let review_array = new Array();

    let index =  page_number*5;

    while (index<(page_number+1)*5 && index < review_docs.length){
        if (review_docs[index]!==undefined){
            review_array.push(review_docs[index]);
        }
        index++;
    }

    
    console.log(review_array);
    let str = ''
    //Add view for doc
    switch (view.currentScreen) {
        case 'homeScreen':

            for (let i = 0; i < review_array.length; i++) {
                str += component.blogEntries(review_array[i]);
            }
            
            document.getElementById('featured-post').innerHTML = str;
                
            //Set redirect button
            document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
                element.style.cursor='pointer';
                element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
            });
        break;
            
        case 'adminScreen':

            for (let i = 0; i < review_array.length; i++) {
                str += component.adminReview(review_array[i]);
            }

            console.log(str);
            document.getElementById('review-ctrl').innerHTML = str
            

            document.querySelectorAll('.delete').forEach(ele => {
                ele.addEventListener('click',async ()=>{
                    await deleteDoc(doc(db, "Review", ele.getAttribute('value')));
                })
            })
        
            document.querySelectorAll('.watch').forEach(ele => {
                ele.addEventListener('click', ()=>{
                    view.setScreen('reviewDetailScreen', ele.getAttribute('value'));
                })
            })
        break;
    }
}

//Show review detail information at current review page
controller.showCurrentReviewDetail = async (review_id) =>{
    let review_docRef = await getDoc(doc(db, "Review", review_id));
    
    if (review_docRef.exists()) {
        let user_object =  await controller.getUserObjectByReview_docRef(review_docRef.data());

        if (user_object!==undefined){
            document.getElementById('reviewInfo').innerHTML=component.reviewInfo(review_docRef.data(),user_object);
        }

        document.getElementById('commentSection').innerHTML=component.commentSection();
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
    
}

controller.getUserObjectByReview_docRef = async (review_docRef)=>{
    let user_docRef = await getDoc(doc(db,"User", review_docRef.review_creator_id));
    return user_docRef.data();
}

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
        document.getElementById('comment-input').reset();
        console.log(`User ${auth.currentUser.displayName} successfully comment`); 
        document.getElementById('comment-content').disabled = false;
        document.getElementById('comment-btn').disabled = false;      
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}



//Show comment information
controller.showParentComment = async (review_id) => {

    let comment_query = await (query(collection(db,'Comment'),and(where('comment_review_id','==',review_id),where('comment_parent_id','==',null))))

    onSnapshot(comment_query,(qr)=>{
        let str='';
        let count = 0;
        qr.forEach(doc =>{
            str+=component.displayedParentComment(doc); 
            count++;
        });
        document.getElementById('comment-output').innerHTML=str;
        if (count > 0)
        { 
            document.querySelectorAll('.reply-btn').forEach(e =>{
                e.style.cursor='pointer';
                e.addEventListener('click', () => view.setScreen('reviewDetailScreen'));
            })
        }
    });
}


////////////////////////////////// BOOK ///////////////////////////////////////

//Show book information
controller.showBook = async () => {
    let bookResult = await book.resolveQuery(document.getElementById('bookSearchinput').value.replace(/\s+/g, ''));
    document.getElementById('bookSearchList').innerHTML +=
    `<div class="card-body overflow-auto" style="max-height: 300px">
        <div id="bookSearchoutput"></div>
    </div>`;

    document.getElementById('bookSearchoutput').innerHTML=component.bookSearchOutput(bookResult); 
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


// controller.getReviewDocs = async () => {
//     return await getDocs(collection(db, 'Review'));
// }

// controller.getCommentDocs = async () => {
//     return await getDocs(collection(db, 'Comment'));
// }

// controller.getUserDocs = async () => {
//     return await getDocs(collection(db,'User'));
// }




controller.showReviewAdministration = async () => {
    controller.updateReviewPage();

}


controller.getUserDocs = async () => {
    return await getDocs(collection(db,'User'));
}

////////////////////////////////// CATEGORIES ///////////////////////////////////////

controller.getReviewByCategory = async (category) => {
    return await query(collection(db, 'Review'), where('review_category', '==', 1))
}



////////////////////////////////// PENDING REVIEW ///////////////////////////////////////


controller.showPendingReviews = async () => {
    let review_query = query(collection(db, 'Review'), where('review_status', '==', 'pending'), orderBy('review_created_date','desc'))

    onSnapshot(await review_query, async ()=>{
        let str=''; 

        let review_docs = await getDocs(review_query);

        let user_docs = await getDocs(collection(db, 'User'));

        for (let i in review_docs.docs){
            for (let j in user_docs.docs){
                if (review_docs.docs[i] == undefined){
                    console.log(user_docs.docs[i].id);
                } else if (review_docs.docs[i].data().review_creator_id===user_docs.docs[j].id){
                    
                    str+=component.adminPendingReview(review_docs.docs[i],user_docs.docs[j]);
                    
                }
            }
        }
    
        document.getElementById('pendingReviewoutput').innerHTML = str;
    
        document.querySelectorAll('.delete').forEach(ele => {
            ele.addEventListener('click',async ()=>{
                await deleteDoc((doc(db, "Review", ele.getAttribute('value'))));
            })
        })

        document.querySelectorAll('.approve').forEach(ele => {
            ele.addEventListener('click',async ()=>{
                await updateDoc(doc(db, 'Review', ele.getAttribute('value')), {review_status:'active'})
            })
        })
    
        document.querySelectorAll('.watch').forEach(ele => {
            ele.addEventListener('click', ()=>{
                view.setScreen('reviewDetailScreen', ele.getAttribute('value'));
            })
        })
    })
}

