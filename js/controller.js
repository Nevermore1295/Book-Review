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
        if(auth.currentUser===null){
            document.getElementById('user-auth').innerHTML=component.Authentication(false);
            document.getElementById('modal-control').innerHTML = component.loginModal();
            document.getElementById('login').addEventListener('submit', (e) => {
                e.preventDefault();
                controller.login();
                // document.getElementById('login').reset(); 
            });   

            view.setScreenButtonByID('register','registerScreen');

        } else {
            document.getElementById('user-auth').innerHTML=component.Authentication(true);
            document.getElementById('review-btn-li').style.display = 'block';
            document.getElementById('modal-control').innerHTML = ``;
            controller.authCheck();
            document.getElementById('user-review').addEventListener('click',()=>{
                view.setScreen('userReviewScreen');
            })
            document.getElementById('log-out').addEventListener('click',()=>{
                controller.logout();
            });
        }
    })
}


controller.authCheck = async () => {
    // .data().user_authority
    let docRef = await (getDoc(doc(db, "User", auth.currentUser.uid)));
    if (await docRef.data().user_authority==2){
        document.getElementById('admin-btn-li').style.display = 'block';
        document.getElementById('admin-btn-li').innerHTML = 
        `
            <a id="admin-btn">Administration</a>
        `;
        view.setScreenButtonByID('admin-btn','adminScreen');
    } else {
        document.getElementById('admin-btn-li').style.display = 'none';
    }
    document.getElementById('review-btn-li').style.display = 'block';
        document.getElementById('review-btn-li').innerHTML = 
        `
            <a id="review-btn">Make a review</a>
        `;
        view.setScreenButtonByID('review-btn','reviewCreatorScreen');
}

controller.showAuthorSetting = async (review_creator_id) =>{
}

//Auth check for comment
controller.commentAuthCheck = async (review_id, author_id) => {
    await auth.onAuthStateChanged(async ()=>{
        let comment_query = query(collection(db,'Comment'),where('comment_review_id','==',review_id));
        console.log(comment_query);
        let comment_query_docs = await getDocs(comment_query);

        if (view.currentScreen==='reviewDetailScreen'){
            if (auth.currentUser!==null) {
                document.getElementById('commentSection').innerHTML=component.commentSection();
                document.getElementById('comment-input').innerHTML =`
                <form class="mb-4 d-flex" id="comment-form">
                    <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!"></input>
                    <button class="btn btn-block btn-lg btn-primary" id="comment-btn">Submit</button>
                </form>
                `
                document.getElementById('comment-form').addEventListener('submit', (cf) =>{
                    cf.preventDefault();
                    //Add data object to doc
                    document.getElementById('comment-content').disabled = true; //prevent creating multiple comment from multi-clicking
                    document.getElementById('comment-btn').disabled = true;      
                    controller.addComment(review_id); 
                               
                })
                await controller.showComment(comment_query);
            } else {
                if (comment_query_docs.size!=0){
                    console.log(comment_query_docs.docs);
                    document.getElementById('commentSection').innerHTML=component.commentSection();
                    await controller.showComment(comment_query);
                } 
                // console.log(document.getElementById("comment-input"));
                // document.getElementById("comment-input").style.setProperty("display", "none", "important");
                // if (document.getElementById('comment-output').innerHTML=='') {
                //     document.getElementById('comment-card').style.setProperty("display","none","important");
                // }

            }
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
    if (initialData.password=="" || initialData.email=="")
    {
        alert("Please enter your email and password.");
        document.getElementById('password-login').value = '';
    }
    else {
        await signInWithEmailAndPassword(auth, initialData.email, initialData.password).then(user => {
            console.log(`User ${user.user.displayName} successfully logged in`);
            $('body').removeAttr("style");
            $('body').removeAttr("class");
            $('.modal-backdrop').remove();
        }).catch(err => {
            // Catch error
            document.getElementById('login-error').innerHTML = `
                <p style="color: red;">Sign in failed! Please try again</p>
            `
            document.getElementById('password-login').value = '';
        });
    }
    
}

//Logout
controller.logout = async () =>{
    await signOut(auth).then(() => {
        if (view.currentScreen==='adminScreen'){
            view.setScreen('homeScreen');
        }
        document.getElementById('review-btn-li').style.display = 'none';
        document.getElementById('admin-btn-li').style.display = 'none';
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
        alert('Missing username');
    } else if (initialData.user_name.trim().length < 4) {
        //Kiểm tra độ dài username
        alert('Username must be at least 4 characters')
    } else if (initialData.user_email.trim() === '')
    {
        alert('Missing email')
    } else if (initialData.user_password !== document.getElementById('pwconfirmation').value) {
        //Xác nhận mật khẩu
        alert('Password and password confirmation must be the same')
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
                await createUserWithEmailAndPassword(auth, initialData.user_email, initialData.user_password).then( async cred => {
                    // Create data firestore
                    const docRef = doc(db, 'User', cred.user.uid)
                    setDoc(docRef, initialData, { merge: false })
                    console.log(`User ${initialData.user_name} successfully registered`);
                    updateProfile(auth.currentUser, {displayName: initialData.user_name,});
                    await signInWithEmailAndPassword(auth, initialData.user_email, initialData.user_password).then(user => {
                        console.log(`User ${user.user.displayName} successfully logged in`)
                        view.setScreen('homeScreen');
                    });
                        
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

controller.showReviewList = async () => {
    let review_query = await (query(collection(db,'Review') ,where('review_status','==','active'), orderBy('review_created_date','desc'))); 

    let review_docs = await getDocs(review_query);

    let user_docs = await getDocs(collection(db, 'User'));   

    controller.showCurrentReviewList(review_docs.docs, user_docs ,0).then(()=>{
            // let review_active = await getDocs(collection(db,'Review'), where('review_status','==','active'), orderBy('review_created_date','desc'));
        controller.Pagination(review_docs.docs, user_docs);
    }) 
}


//Hiển thị trang
controller.Pagination = async (review_docs, user_docs) => {

    let page_quantity = Math.trunc((review_docs.length/5));

    if (review_docs.length<=5){
        page_quantity = 1
    } else if (review_docs.length%5!=0){
        page_quantity++;
    }

    // console.log(page);
    let current_page = 1;
    document.getElementById('review-page').innerHTML=component.pagination(current_page,page_quantity);
    controller.checkPagePosition(review_docs, user_docs, current_page, page_quantity);
   
}

//Kiểm tra tra và xử lí chuyển trang
controller.checkPagePosition = (review_docs, user_docs, current_page, page_quantity)=>{
    if (current_page===1){
        document.getElementById('previous-page').disabled =true;
    } else {
        document.getElementById('previous-page').disabled =false;
        document.getElementById('previous-page').addEventListener('click', ()=>{
            current_page--;
            controller.showCurrentReviewList(review_docs, user_docs,current_page-1);
            document.getElementById('review-page').innerHTML=component.pagination(current_page,page_quantity);
            controller.checkPagePosition(review_docs, user_docs, current_page,page_quantity);
        });
    }

    if (current_page>=page_quantity){
        document.getElementById('next-page').disabled =true;    
    } else {
        document.getElementById('next-page').disabled =false;
        document.getElementById('next-page').addEventListener('click', async ()=>{       
            current_page++;
            controller.showCurrentReviewList(review_docs, user_docs,current_page-1);
            document.getElementById('review-page').innerHTML=component.pagination(current_page,page_quantity);
            controller.checkPagePosition(review_docs, user_docs, current_page,page_quantity);
        });
    }
}

//Hiển thị trang hiện tại
controller.showCurrentReviewList = async (review_docs,user_docs,page_number) => {

    let review_array = new Array();

    let index =  page_number*5;

    while (index<(page_number+1)*5 && index < review_docs.length){
        if (review_docs[index]!==undefined){
            review_array.push(review_docs[index]);
        }
        index++;
    }

    let str = ''
         
    //Add view for doc
    switch (view.currentScreen) {
        case 'homeScreen':    
            for (let i in review_array) {
                for (let j in user_docs.docs){
                    if (review_array[i].data().review_creator_id===user_docs.docs[j].id){
                        str+=component.blogEntries(review_array[i],user_docs.docs[j]);
                    }
                }                
            }
            
            document.getElementById('featured-post').innerHTML = str;
                
            //Set redirect button
            document.querySelectorAll('.reviewScreen, .review-show').forEach(element=>{
                element.style.cursor='pointer';
                element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('value')));
            });
        break;
            
        case 'adminScreen':
            
            for (let i in review_array) {
                for (let j in user_docs.docs){
                    if (review_array[i].data().review_creator_id===user_docs.docs[j].id){
                        str += component.adminReview(review_array[i],user_docs.docs[j]);
                    }
                }                
            }
            document.getElementById('review-ctrl').innerHTML = str

            document.querySelectorAll('.edit').forEach(ele => {
                ele.addEventListener('click',async ()=>{
                    view.setScreen('reviewEditorScreen', ele.getAttribute('value'));
                })
            })
        
            document.querySelectorAll('.watch').forEach(ele => {
                ele.addEventListener('click', ()=>{
                    view.setScreen('reviewDetailScreen', ele.getAttribute('value'));
                })
            })

            
            document.querySelectorAll('.delete').forEach(ele => {
                ele.addEventListener('click', async ()=>{   

                    let comment_docs = await getDocs(query(collection(db,"Comment"),where('comment_review_id',"==",ele.getAttribute('value'))));
                    
                    for (let i in comment_docs.docs){
                        console.log(comment_docs.docs[i].data().comment_review_id);
                        deleteDoc(doc(db, "Comment", comment_docs.docs[i].id));
                    }

                    deleteDoc(doc(db, "Review", ele.getAttribute('value')));
            
                    // await deleteDoc(doc(db, "Comment", e))
                })
            })

        break;
    }
}

//Show review detail information at current review page
controller.showCurrentReviewDetail = async (review_id) =>{
    
    let review_docRef = await getDoc(doc(db, "Review", review_id));
    
    if (review_docRef.exists()) {
        let user_docRef =  await getDoc(doc(db,"User", review_docRef.data().review_creator_id));

        if (user_docRef!==undefined){
            document.getElementById('reviewInfo').innerHTML=component.reviewInfo(review_docRef.data(),user_docRef.data());
        }

        document.getElementById('commentSection').innerHTML=component.commentSection();

        //Show comment bar and button
        controller.commentAuthCheck(review_id,user_docRef.id);
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
    
}


//Add comment to firestore
controller.addComment = async (review_id) =>{

    //Get comment information and create a comment data object  
    const initialData = {
        comment_creator_id: auth.currentUser.uid,
        comment_created_date: Timestamp.now(),
        comment_review_id: review_id,
        comment_content: document.getElementById('comment-content').value.trim(),
    };

    //Add comment data object to firestore and return a Promise
    return await addDoc(collection(db, 'Comment'),initialData).then(() => {
        // Reset form
        document.getElementById('comment-form').reset();
        console.log(`User ${auth.currentUser.displayName} successfully comment`); 
        document.getElementById('comment-content').disabled = false;
        document.getElementById('comment-btn').disabled = false;      
    }).catch(err => {
        // Catch error
        console.log(err.message);
    });
}



//Show comment information
controller.showComment = async (comment_query) => {


    onSnapshot(comment_query, async ()=>{

        let comment_docs = await getDocs(comment_query);

        let user_docs = await getDocs(collection(db, 'User'));

        let str='';
        for (let i in comment_docs.docs){
            for (let j in user_docs.docs){
                if (comment_docs.docs[i] == undefined){
                    console.log(user_docs.docs[i].id);
                } else if (comment_docs.docs[i].data().comment_creator_id===user_docs.docs[j].id){
                    str+=component.showComment(comment_docs.docs[i],user_docs.docs[j]); 
                }
            }
        }
        document.getElementById('comment-output').innerHTML=str;

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


////////////////////////////////// CATEGORIES ///////////////////////////////////////

controller.getReviewByCategory = async (category) => {
    return await query(collection(db, 'Review'), where('review_category', '==', 1))
}



////////////////////////////////// PENDING REVIEW ///////////////////////////////////////


controller.showPendingReviews = async () => {
    let review_query = query(collection(db, 'Review'), where('review_status', '==', 'pending'), orderBy('review_created_date','desc'))

    onSnapshot(review_query, async ()=>{
        let review_docs = await getDocs(review_query);
        if (review_docs.docs.length>0){
            let str=''; 
    
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
                    await deleteDoc(doc(db, "Review", ele.getAttribute('value')));
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
        }
    })   
}


////////////////////////////////// SEARCH REVIEW ///////////////////////////////////////
controller.searchReview = async (collection_value) =>{
    let review_docs = await getDocs(collection(db,'Review'));  

    let user_docs = await getDocs(collection(db, 'User'));

    let str= '';
    if (collection_value==null){
        for (let i in review_docs.docs){
            for (let j in user_docs.docs){
                if (review_docs.docs[i] == undefined){
                    console.log(user_docs.docs[i].id);
                } else if (review_docs.docs[i].data().review_creator_id===user_docs.docs[j].id){
                    str += component.reviewQueryoutput(review_docs.docs[i],user_docs.docs[j])
                }
            }
        }
    } else {
        for (let i in review_docs.docs){
            if (review_docs.docs[i].data().review_category===collection_value){
                console.log(review_docs.docs[i].data());
                for (let j in user_docs.docs){
                    if (review_docs.docs[i] == undefined){
                        console.log(user_docs.docs[i].id);
                    } else if (review_docs.docs[i].data().review_creator_id===user_docs.docs[j].id){
                        str += component.reviewQueryoutput(review_docs.docs[i],user_docs.docs[j])
                    }
                }
            }
        }
    }
  

    document.getElementById('reviewQueryList').innerHTML = str;

    document.getElementById('reviewQuerySearchbar').addEventListener('submit',(btn)=>{
        btn.preventDefault();

        str= '';

        let search_value = document.getElementById('review-Searchbar-input').value;
        
        for (let i in review_docs.docs){
            for (let j in user_docs.docs){
                if (review_docs.docs[i] == undefined){
                    console.log(user_docs.docs[i].id);
                } else if (review_docs.docs[i].data().review_creator_id===user_docs.docs[j].id){
                    if (RegExp(search_value.trim().toLowerCase()).test(review_docs.docs[i].data().review_title.toLowerCase())){
                        str += component.reviewQueryoutput(review_docs.docs[i],user_docs.docs[j])
                    } else if (RegExp(search_value.trim().toLowerCase()).test(review_docs.docs[i].data().review_book_title.toLowerCase())){
                        str += component.reviewQueryoutput(review_docs.docs[i],user_docs.docs[j])
                    }   
                }
            }
        }


        document.getElementById('reviewQueryList').innerHTML = str;
         //Set redirect button
         document.querySelectorAll('.imgScreen, .titleScreen').forEach(element=>{
            element.style.cursor='pointer';
            element.addEventListener('click', () => view.setScreen('reviewDetailScreen', element.getAttribute('id')));
        });
    })
}

////////////////////////////////// User Reviews ////////////////////////////////////

controller.showUserReviews = async () => {
    console.log(auth.currentUser);
    let review_query = query(collection(db, 'Review'), where('review_creator_id', '==', auth.currentUser.uid))
    let str=''; 
    let review_docs = await getDocs(review_query);
    if (review_docs.docs.length>0){
        for (let i in review_docs.docs){
        
            if (review_docs.docs[i] == undefined){
                console.log(user_docs.docs[i].id);    
            } else {
                str+=component.userReviewItem(review_docs.docs[i])
            }
            
        }

        document.getElementById('user-review-list').innerHTML = str;
        document.querySelectorAll('.watch').forEach(ele => {
            ele.addEventListener('click', ()=>{
                view.setScreen('reviewDetailScreen', ele.getAttribute('value'));
            })
        })
    
        document.querySelectorAll('.edit').forEach(ele => {
            ele.addEventListener('click',async ()=>{
                view.setScreen('reviewEditorScreen', ele.getAttribute('value'));
            })
        })

    }
}


////////////////////////////////// Editor /////////////////////////////////////////

controller.setEditorInfo = async (review_id) => {
    let review_doc = await getDoc(doc(db,'Review', review_id));
    console.log(review_doc.data());
    document.getElementById('editor-thumbnail').src = review_doc.data().review_book_thumbnail;
    document.getElementById('editor-book-title').value = review_doc.data().review_book_title;
    document.getElementById('editor-authors').value = review_doc.data().review_book_authors;
    document.getElementById('editor-bid').value = review_doc.data().review_book_id;
    document.getElementById('editor-category').value = review_doc.data().review_category;
    document.getElementById('editor-title').value = review_doc.data().review_title;
    document.getElementById('editor-content').value = review_doc.data().review_content;

    document.getElementById('editor-save-btn').addEventListener('click',async (e) => {
        e.preventDefault();
        await updateDoc(doc(db, 'Review', review_id), {
            review_status:'update-pending',
            review_category: document.getElementById('editor-category').value,
            review_title: document.getElementById('editor-title').value.trim(),
            review_content: document.getElementById('editor-content').value.trim()
    }).then (()=>{
        view.setScreen('reviewDetailScreen', review_id);
    })
    });
    document.getElementById('modal-control').innerHTML = component.deleteModal();
    document.getElementById('editor-delete-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await deleteDoc(doc(db, "Review", review_id));
            view.setScreen('homeScreen');

    })

    document.getElementById('editor-discard-btn').addEventListener('click', (e) =>{
        e.preventDefault();
        view.setScreen('homeScreen');
    })
}
