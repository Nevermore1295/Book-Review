import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut ,updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, query, where, and, or, doc, addDoc, setDoc, getDocs, getDoc, orderBy, onSnapshot, Timestamp, limit, startAt, endAt, deleteDoc} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { auth,db } from "./index.js";
import { view } from "./view.js";
import { component } from "./component.js";
import { book } from "./bookfinder.js";

export const controller = {};
////////////////////////////////// AUTHENCIATOR ///////////////////////////////////////
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
            return true;

        } else {
            document.getElementById('user-auth').innerHTML=component.Authentication(true);
            document.getElementById('review-btn-li').style.display = 'block';
            controller.isAdmin();
            document.getElementById('log-out').addEventListener('click',()=>{
                controller.logout();
            });
            return false;
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

    console.log(initialData)
    
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

// controller.updateReviewPage = async (data_map) => {
//     let review_query = await (query(collection(db,'Review'),orderBy('review_created_date','desc'))); 

//     onSnapshot(review_query, async (qr)=>{

//         //Define Map variable to store <key,value>
//         let data_promise = controller.getReviewMap(qr);
//         let key_array = new Array();

//         data_promise.then(async ()=>{
//             let data_map = await data_promise;

//             // //Define Array variable to store <key>
        
                
//             // // //Set mapping and push key
//             // // qr.forEach(async (doc) =>{
//             // //     data_map.set(doc.id, await controller.createReviewObject(doc.data()));
//             // //     key_array.push(doc.id);
//             // // });
            
//             // data_map.forEach((value,key,map)=>{
//             //     key_array.push(key);
//             //     // console.log(key_array);
    
//             //     // console.log(data_map);
//             // })
    
//             console.log(key_array);
    
//             console.log(data_map);
    
            
//         }).then(()=>{
//             controller.showReviewPage(data_map, key_array);
//         })
//     }) 
// }

controller.updateReviewPage = async () => {
    let review_query = await (query(collection(db,'Review'),orderBy('review_created_date','desc'))); 

    onSnapshot(review_query,(qr)=>{

        let data_map = new Map();
        let key_array = new Array();

        qr.forEach(async (doc) =>{
            data_map.set(doc.id, doc.data());
            key_array.push(doc.id);
            // key_array.push(doc.id);
            data_map.set(doc.id, await controller.createReviewObject(doc.data()));
        });

        // qr.forEach(async (doc) =>{
        //     data_map.set(doc.id, await controller.createReviewObject(doc.data()));
        //     // key_array.push(doc.id);
        // });
    
        controller.showReviewPage(data_map, key_array)
       

    })
}

controller.showReviewPage = async (data_map, key_array) => {

  
    // console.log(data_map);

    let page = (key_array.length/5)+1;

    // console.log(page);

    // let block = (page/3);
    controller.showCurrentReviewPage(data_map,key_array,0);
    document.getElementById('review-page').innerHTML=component.reviewPage(page);

    document.querySelectorAll('.page-item').forEach(item =>{
        
        item.addEventListener('click', ()=>{
            document.querySelectorAll('.page-item').forEach (childitem =>{
                childitem.setAttribute('class','page-item');
            })

            item.setAttribute('class','page-item active');

            controller.showCurrentReviewPage(data_map,key_array,item.getAttribute('value')-1);
        });
    });
}


//Show review at Homepage
controller.showCurrentReviewPage = (data_map,key_array,page) => {
    let current_key = new Array();
    
    let i1 = page*5 ;

    // +
    // console.log(await key_array);
    // console.log(await key_array[i1]);

    while (i1<(page+1)*5 && key_array[i1]!==undefined){
        current_key.push(key_array[i1]);
        i1++;
        
    };
    console.log(current_key);

    //Add view for doc
    switch (view.currentScreen) {
        case 'homeScreen':
            document.getElementById('featured-post').innerHTML = component.blogEntries(data_map, current_key);
                
            //Set redirect button
            document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
                element.style.cursor='pointer';
                element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
            });
        break;
            
        case 'adminScreen':
            document.getElementById('review-ctrl').innerHTML = component.adminReview(data_map,current_key);
            let i2=0;
            document.querySelectorAll('.delete').forEach(ele => {
                let str=current_key[i2].toString();
                ele.addEventListener('click',async ()=>{
                    await deleteDoc((doc(db, "Review", str)));
                })
                i2++;
            })

            document.querySelectorAll('.watch').forEach(ele => {
                ele.addEventListener('click', ()=>{
                    view.setScreen('reviewDetailScreen', ele.getAttribute('value'));
                })
                i2++;
            })
        break;
    }
}

//Show review detail information at current review page
controller.showCurrentReviewDetail = async (review_id) =>{
    let review_docRef = await getDoc(doc(db, "Review", review_id));
    
    if (review_docRef.exists()) {

        document.getElementById('reviewInfo').innerHTML=component.reviewInfo(await controller.createReviewObject(review_docRef.data()));

        document.getElementById('commentSection').innerHTML=component.commentSection();
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
    
}

controller.createReviewObject = async (review_docRef)=>{
    let review_creator_id = review_docRef.review_creator_id;

    let user_docRef = await getDoc(doc(db,"User", review_creator_id));

    let review_object = review_docRef;

    review_object.review_creator_id = user_docRef.data().username;

    return review_object;
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

//Get parent comment query from firestore
controller.getCurrentCommentQuery = async (comment_review_id) => {
    //,where('comment_created_date','!=',null)),orderBy('comment_created_date')
    return await (query(collection(db,'Comment'),and(where('comment_review_id','==',comment_review_id),where('comment_parent_id','==',null))));
}


//Show comment information
controller.showParentComment = async (review_id) =>{
    onSnapshot(await controller.getCurrentCommentQuery(review_id),(qr)=>{
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
    const doc = await getDocs(collection(db, 'Review'), where('review_status', '==', 'pending'));
    let str='';
    console.log(doc.size)
    doc.forEach( async (q) =>{
        str+=`
        <div class="card bg-white my-2">
            <div class="card-body d-flex justify-content-between">
                <div class="d-flex">
                    <img class="mt-1" src="${q.data().review_book_thumbnail}" height="120" width="90">
                    <div class="resultBasic ms-3">
                        <h5>${q.data().review_title}</h5>
                        <div><b>Book: </b>${q.data().review_book_title}</div>
                        <div><b>Author: </b>${q.data().review_book_authors}</div>
                        <div><b>User:</b> username</div>
                        <div><b>Date posted: </b>${q.data().review_created_date.toDate().toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
                    </div>    
                </div>
                <div class="modify-btn d-flex align-items-center flex-column flex-lg-row">
                    <button class="btn btn-primary m-1"><i class="fa-solid fa-eye" style="width: 18px"></i></button>
                    <button class="btn btn-primary m-1"><i class="fa-solid fa-check" style="width: 18px"></i></button>
                    <button class="btn btn-primary m-1"><i class="fa-solid fa-xmark" style="width: 18px"></i></button>
                </div>
            </div>
        </div>`;
        console.log(q.data());
        await book.searchBookByID(q.data().review_book_id)
    })
    document.getElementById('pendingReviewoutput').innerHTML += str;
}


controller.g