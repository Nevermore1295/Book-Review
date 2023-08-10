import { auth, db } from "./index.js";

export let component = {};

component.Authentication = (isUserExist) => {
    if (isUserExist === true) {
        return ` 
            <div class="d-flex align-content-center me-5">
                <div class="dropdown">
                    <i class="navbar-nav ms-auto fa-solid fa-user" type="button" data-bs-toggle="dropdown" style="font-size:25px" >
                    </i>
                    <ul class="dropdown-menu account-dropdown">
                        <li class="dropdown-item"><b>${auth.currentUser.displayName}</b></li>
                        <li class="dropdown-item" style="cursor: pointer">Information</li>
                        <li class="dropdown-item" style="cursor: pointer">Your Review</li>
                        <li class="dropdown-item" id="log-out" style="cursor: pointer">Log Out</li>
                    </ul>
                </div>
            </div>
        `
    } else {
        return `
        <div class="d-flex align-content-center me-5">
            <div class="dropdown">
            <!-- Button trigger modal -->
            <i type="button" id="login-modal" class="navbar-nav ms-auto fa-solid fa-user" data-bs-toggle="modal" data-bs-target="#LoginModal" style="font-size:25px"></i>
            <!-- Modal -->
            <div class="modal fade" id="LoginModal" tabindex="-1" aria-labelledby="LoginModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content container">
                        <div class="modal-header">
                            <h4>Login</h4>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body container">
                            <form id="login">
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="form2Example1">Email address</label>
                                    <input type="email" id="email-login" class="form-control validate text-4b88a2" />
                                </div>
                                <div class="form-outline mb-4">
                                    <label class="form-label" for="form2Example2">Password</label>
                                    <input type="password" id="password-login" class="form-control validate text-4b88a2" />
                                </div>      
                                <div class="row mb-4 d-flex justify-content-between" >
                                    <button id="signin-button" class="btn btn-primary btn-sm btn-block col-2 mb-4 close" data-bs-dismiss="modal" aria-label="Close">Sign in</button>
                                    <div class="col-4">   
                                        <a href="#!">Forgot password?</a>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <p>Not a member? <a class="text-primary close" type="button" data-bs-dismiss="modal" aria-label="Close" id="register">Register</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
            `
    }
}


component.navbar = () => {
    return `
        <nav class="header navbar navbar-expand-lg shadow navbar-light bg-white">
            <div class="container">
                <a class="navbar-brand" id="navbar-brand">BookReview</a>
                <button class="navbar-toggler button-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto" id="navbtn">
                        <li class="dropdown">
                            <a id="home-btn">Home</a>
                        </li>
                        <li class="dropdown">
                            <a class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Collections
                            </a>
                            <div class="dropdown-menu mt-lg-3" aria-labelledby="dropdownMenuButton1">
                                <div class="d-flex">
                                <div class="dropdown-row" style="width: calc(100%/3)">
                                    <a class="dropdown-item" href="#">Action & Adventure</a>
                                    <a class="dropdown-item" href="#">Biographies/religion</a>
                                    <a class="dropdown-item" href="#">Business</a>
                                    <a class="dropdown-item" href="#">Comics</a>
                                    <a class="dropdown-item" href="#">Education</a>
                                </div>
                                <div class="dropdown-row" style="width: calc(100%/3)">
                                    <a class="dropdown-item" href="#">Entertainment</a>
                                    <a class="dropdown-item" href="#">History</a>
                                    <a class="dropdown-item" href="#">Medical/lifestyle</a>
                                    <a class="dropdown-item" href="#">Literature & fiction</a>
                                    <a class="dropdown-item" href="#">Science & technology</a>
                                </div>
                                <div class="dropdown-row" style="width: calc(100%/3)">
                                    <a class="dropdown-item" href="#">Sport</a>
                                    <a class="dropdown-item" href="#">Medical/lifestyle</a>
                                    <a class="dropdown-item" href="#">Others</a>
                                </div>
                                </div>
                            </div>
                        </li>
                        <li class="dropdown">
                            <a id="search-btn">Search</a>
                        </li>  
                        
                        <li class="dropdown" id="review-btn-li">
                            <a id="review-btn">Make a review</a>
                        </li>
                        <li class="dropdown" id="admin-btn-li">
                            <a id="admin-btn">Administration</a>
                        </li>
                        <li class="dropdown">
                            <a id="about-btn">About</a>
                        </li>
                    </ul>
                    <a id="user-auth">
                    </a>
                </div>
            </div>
        </nav>
    `
};

component.header = () => {
    return `
    <header class="py-5 bg-light border-bottom mb-4">
        <div class="container">
            <div class="text-center my-5">
                <h1 class="fw-bolder">Welcome to Blog Home!</h1>
                <p class="lead mb-0">A Bootstrap 5 starter layout for your next blog homepage</p>
            </div>
        </div>
    </header>
`};

component.sideWidget = () => {
    return `
    <!-- Side widgets-->
    <div class="col-lg-4">
        <!-- Search widget-->
        <div class="card mb-4">
            <div class="card-header">
                Search
            </div>
            <div class="card-body">
                <div class="input-group">
                    <input class="form-control" type="text" placeholder="Enter search term..." aria-label="Enter search term..." aria-describedby="button-search" />
                    <button class="btn btn-primary" id="button-search" type="button">Go!</button>
                </div>
            </div>
        </div>
        <!-- Categories widget-->
        <div class="card mb-4">
            <div class="card-header">
                Categories
            </div>
            <div class="card-body">
                <div class="row">
                        <ul class="list-unstyled mb-0">
                            <li><a href="#!">Action & adventure</a></li>
                            <li><a href="#!">Biography/religion</a></li>
                            <li><a href="#!">Bussiness</a></li>
                            <li><a href="#!">Comics</a></li>
                            <li><a href="#!">Education</a></li>
                            <li><a href="#!">Entertainment</a></li>
                            <li><a href="#!">History</a></li>
                            <li><a href="#!">Medical & Lifestyle</a></li>
                            <li><a href="#!">Literature & fiction</a></li>
                            <li><a href="#!">Science</a></li>
                            <li><a href="#!">Sport</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
}



component.blogEntries = (review_doc) => {

    return `<div class="card mb-4 flex-row align-items-center">
        <a class="reviewScreen" value="${review_doc.id}"><img src="http://books.google.com/books/content?id=bVFPAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"></a>
        <div class="card-body">
            <h2 class="card-title">${review_doc.data().review_title}</h2>
            <span class="small text-muted">${review_doc.data().review_creator_id}</span>
            <span class="small text-muted">${review_doc.data().review_created_date.toDate().toLocaleString('en-GB', { timeZone: 'UTC' })}</span>
            
            <p class="card-text overflow-hidden" style="max-height: 70px">${review_doc.data().review_content}</p>
            <a class="btn btn-primary review-show" value="${review_doc.id}">Read more →</a>
        </div>
    </div> `;
}



component.homeContent = () => {
    return `
    <!-- Page content-->
    <div class="container">
        <div class="row">
            <!-- Blog entries-->
            <div class="col-lg-8">

                <div id="featured-post">                    
                </div>

                <div id="review-page">
                </div>
              
            </div>
            ${component.sideWidget()}
        </div>
    </div>`
};

component.pagination = (current_page,page_quantity) => {
    return`
    <nav aria-label="Pagination">
        <hr class="my-0">
        <ul class="pagination justify-content-end my-4 me-3">
            <li class="page-item" id="previous-page"><a class="page-link"><i class="fa-solid fa-angle-left"></i></a></li>
            <li class="page-item">${current_page}/${page_quantity}</li>
            <li class="page-item" id="next-page"><a class="page-link"><i class="fa-solid fa-angle-right"></i></a></li>            
        </ul>
    </nav>
    `;
}


//**********************Review Detail Screen***********************
component.reviewInfo = (review_data,user_data) => {
    return `
    <!-- Post content-->
        <!-- Post header-->
        <header class="mb-4">
            <!-- Post title-->
            <h1 class="fw-bolder mb-1">${review_data.review_title}</h1>
            <!-- Post meta content-->
            <div class="text-muted fst-italic mb-2">Created by ${user_data.user_name} in ${review_data.review_created_date.toDate().toLocaleString('en-GB', { timeZone: 'UTC' })}</div>          
            <!-- Post categories-->
            <a class="badge bg-secondary text-decoration-none link-light" href="#!">${data.review_category}</a>
        </header>
        
        <!-- Post content-->
        <div class="mb-4">
            <img class="rounded ms-2 mt-2 me-3" height="300" src="${data.review_book_thumbnail}">
            <p class="d-inline fs-5 mb-4" style="text-align: justify">${data.review_content}</p>
        </div>  
`
}

//Demo
// component.displayedParentComment = (data) => {
//     return `
//     <div class="d-flex mb-4">
//         <!-- Parent comment-->
//         <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
//         </div>
//         <div class="ms-3">
//             <div class="fw-bold">
//                 Commenter Name
//             </div>
//             If you're going to lead a space frontier, it has to be government; it'll never be private enterprise. Because the space frontier is dangerous, and it's expensive, and it has unquantified risks.
//             <!-- Child comment 1-->
//             <div class="d-flex mt-4">
//                 <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
//                 </div>
//                 <div class="ms-3">
//                     <div class="fw-bold">
//                         Commenter Name
//                     </div>
//                     And under those conditions, you cannot establish a capital-market evaluation of that enterprise. You can't get investors.
//                 </div>
//             </div>
//             <!-- Child comment 2-->
//             <div class="d-flex mt-4">
//                 <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
//                 </div>
//                 <div class="ms-3">
//                     <div class="fw-bold">
//                         Commenter Name
//                     </div>
//                     When you put money directly to a problem, it makes a good headline.
//                 </div>
//             </div>
//         </div>
//     </div>
//     `
// }

component.displayedParentComment = (data) => {
    return `
    <div class="mb-3">
        <div class="d-flex">
            <div class="flex-shrink-0">
            <img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
            </div>
            <div class="ms-3">
                <div class="fw-bold">${data.data().comment_creator_id}</div>
                <div style="word-break: break-all">${data.data().comment_content}</div>
                <span class="reply-btn ms-2" style="text-decoration: underline" id="${data.id} style="font-size: 12px">Reply</span>
            </div>
        </div>
        <div class="childComment">

        </div>
    </div>
    `
}

component.displayedChildComment = (data) => {
    return `
    <div class="d-flex">
        <div class="flex-shrink-0">
            <img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
        </div>
        <div class="ms-3 d-flex flex-column">
            <div class="fw-bold">${data.data().comment_creator_id}</div>
            <div style="word-break: break-all">${data.data().comment_content}</div>
            <span class="reply-btn" style="text-decoration: underline" id="${data.id} style="font-size: 12px">Reply</span>
        </div>
    </div>
`}

component.commentSection = (data) => {
    return `
    <!-- Comments section-->
    <div class="mb-5">
        <div class="card bg-light">
            <div class="card-body">
                <!-- Comment form-->
                <form class="mb-4 d-flex" id="comment-input">
                    <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!"></input>
                    <button class="btn btn-block btn-lg btn-primary" id="comment-btn">Submit</button>
                </form>
                <div id="comment-output">
                <div>
            </div>
        </div>
    </div>
`}


component.reviewContent = () => {
    return `
    <!-- Page content-->
    <div class="container mt-5">
        <div class="row">
            <div class="col-lg-8">
                <div id="reviewInfo"></div>
                <div id="commentSection"></div>
            </div>
            ${component.sideWidget()}
        </div>
    </div>
`};


//**********************Register Screen***********************
component.blankNavbar = () => {
    return `
    <div class="navbar navbar-expand-lg navbar-light bg-white shadow">
        <div class="container">
            <a class="navbar-brand" id="navbar-brand">BookReview</a>
        </div>
    </div>
`};


component.registerContent = () => {
    return `
    <div class="container d-flex align-items-center py-4">
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                    <div class="card" style="border-radius: 15px">
                        <div class="card-body p-5">
                            <h2 class="text-uppercase text-center mb-4">
                                Create an account
                            </h2>

                            <form id="register">
                                <div class="form-outline mb-2">
                                    <label class="form-label" for="form3Example1cg">Username</label>
                                    <input type="text" id="username" class="form-control" />
                                </div>

                                <div class="form-outline mb-2">
                                    <label class="form-label" for="form3Example3cg">Your Email</label>
                                    <input type="email" id="email" class="form-control" />
                                </div>

                                <div class="form-outline mb-2">
                                    <label class="form-label" for="form3Example4cg">Password</label>
                                    <input type="password" id="password" class="form-control" />
                                </div>

                                <div class="form-outline mb-3">
                                    <label class="form-label" for="form3Example4cdg">Repeat your password</label>
                                    <input type="password" id="pwconfirmation" class="form-control" />
                                </div>

                                <div class="form-check d-flex justify-content-center mb-4">
                                    <input class="form-check-input me-2" type="checkbox" value=""
                                        id="form2Example3cg" />
                                    <label class="form-check-label" for="form2Example3g">
                                        I agree all statements in
                                        <a href="#!" class="text-body"><u>Terms of service</u></a>
                                    </label>
                                </div>

                                <div class="d-flex justify-content-center">
                                    <button id="register-button" class="btn btn-block btn-lg btn-primary">
                                        Register
                                    </button>
                                </div>

                                <div class="d-flex justify-content-center flex-column flex-sm-row  text-center text-muted mt-4 mb-0">
                                    <p>Have already an account?</p>
                                    <a href="#!" class="fw-bold text-body"><u id="login-btn">Login here</u></a>
                                </div>                    
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
`};

//**********************Review Creator Screen***********************

component.bookSearchContent = () => {
    return `
    <div class="container my-4" style="min-height: 500px"> 
        <h2 class="m-2">Make your review</h2>
        <div id="review-funcscreen">
            <form class="input-group input-group-lg p-4" id="bookSearchbar">
                <input id="bookSearchinput" type="text" class="form-control" placeholder="ISBN / Book's title" ">
                <div class="input-group-append">
                    <button class="btn btn-primary btn-lg">Search</button>
                </div>
            </form>
            <div id="bookSearchList">

            </div>
            <div class="card review-form mt-3">
                <div class="card-body row">
                    <img class="mb-3 col-lg-2" id="rv-thumbnail" src="../assets/Question_mark_(black).png" style="height:160px; width:128px"> 
                    <div class="book-info col-lg-10">
                        <div class="input-group input-group-sm mb-3 w-100">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Book title</span>
                            </div>
                            <input type="text" class="form-control" id="rv-title" aria-describedby="basic-addon1" disabled value="Book name">
                        </div>
                        <div class="row">
                            <div class="input-group input-group-sm mb-3 me-1 col-lg float-start">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Author</span>
                                </div>
                                <input type="text" class="form-control" id="rv-authors" aria-describedby="basic-addon1" disabled value="Author name">
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group input-group-sm mb-3 col-lg float-start">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Published Date</span>
                                </div>
                                <input type="text" class="form-control" id="rv-pd" aria-describedby="basic-addon1" disabled value="1/1/1970">
                            </div>
                            <div class="input-group input-group-sm mb-3 col-lg">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Book-ID</span>
                                </div>
                                <input type="text" class="form-control" id="rv-bid" aria-describedby="basic-addon1" disabled>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-group input-group mb-3 col-lg">
                                <span class="input-group-text" for="inputGroupSelect01">Category</span>
                                <select class="form-select review-forminput" id="rv-category" disabled>
                                <option selected>Choose...</option>
                                <option value="Action & Adventure">Action & Adventure</option>
                                <option value="Biographies/religion">Biographies/religion</option>
                                <option value="Business">Business</option>
                                <option value="Comics">Comics</option>
                                <option value="Education">Education</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="History">History</option>
                                <option value="Medical/lifestyle">Medical/lifestyle</option>
                                <option value="Literature & fiction">Literature & fiction</option>
                                <option value="Science & technology">Science & technology</option>
                                <option value="Sport">Sport</option>
                                <option value="Medical/lifestyle">Medical/lifestyle</option>
                                <option value="Others">Others</option>

                                </select>
                            </div>
                        </div>
                        <form id="Review">
                            <h6>Review Title</h6>
                            <textarea class="form-control review-forminput mb-2" id="Review-title" rows="1" disabled></textarea>
                            <h6>Review</h6>
                            <textarea class="form-control review-forminput mb-2" id="Review-content" rows="6" disabled></textarea>
                            <button class="btn btn-lg btn-primary review-forminput float-end me-2" disabled> Submit </button>
                        <form>
                    </div>
                </div>
            </div>
        </div>
    </div>
`};

component.imageCheck = (index) => {
    if (index === undefined) {
        return "../assets/Question_mark_(black).png";
    } else {
        return index.thumbnail;
    };
}

component.bookSearchOutput = (bookResult) => {
    let str = '';
    for (let index = 0; index < bookResult.length; index++) {
        str +=
            `
        <div class="card bg-white m-2">
            <form class="card-body d-flex justify-content-between">
                <div class="d-flex">
                    <img class="mt-1" src="
                    ${component.imageCheck(bookResult[index].imageLinks)}" height="120" width="90">
                    <div class="resultBasic ms-3">
                        <h5>${bookResult[index].title}</h5>
                        <div><b>Author:</b> ${bookResult[index].authors}</div>
                        <div><b>Date published:</b> ${bookResult[index].publishedDate}</div>
                    </div>
                </div>   
                <button style="height:40px" id="${index}" class="rv-btn btn btn-outline-primary mt-2" type="button">Review</button>
            </form>
        </div>
          `;
    }
    return str;
}

//*********************** Search review ****************************/

component.reviewQuery = () => {
    return `
    <div class="container my-4">
        <h2 class="m-2">Find reviews</h2>
        <form class="input-group input-group-lg p-4" id="reviewQuerySearchbar">
                <input type="text" class="form-control" placeholder="Book/Review" id="review-Searchbar-input">
                <div class="input-group-append">
                    <button class="btn btn-primary btn-lg" type="button">Search</button>
                </div>
        </form>
        <div id="reviewQueryList">
            <div class="overflow-auto" style="max-height: 700px; min-height: 200px"> 
                <div class="reviewQueryoutput">
                    <div class="card bg-white">
                        <div class="card-body d-flex justify-content-between">
                            <div class="d-flex">
                                <img class="mt-1" src="
                                http://books.google.com/books/content?id=bVFPAAAAYAAJ&amp;printsec=frontcover&amp;img=1&amp;zoom=1&amp;edge=curl&amp;source=gbs_api" height="120" width="90">
                                <div class="resultBasic ms-3">
                                    <h5>Title</h5>
                                    <div><b>Book:</b> Report</div>
                                    <div><b>Author:</b> New York State Library</div>
                                    <div><b>User:</b> username</div>
                                    <div><b>Date published:</b> 1916</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header">
                Categories
            </div>
            <div class="card-body">
                <div class="row">
                        <ul class="list-unstyled mb-0">
                            <li><a href="#!">Action & adventure</a></li>
                            <li><a href="#!">Biography/religion</a></li>
                            <li><a href="#!">Bussiness</a></li>
                            <li><a href="#!">Comics</a></li>
                            <li><a href="#!">Education</a></li>
                            <li><a href="#!">Entertainment</a></li>
                            <li><a href="#!">History</a></li>
                            <li><a href="#!">Medical & Lifestyle</a></li>
                            <li><a href="#!">Literature & fiction</a></li>
                            <li><a href="#!">Science</a></li>
                            <li><a href="#!">Sport</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
};

component.reviewQueryoutput = () => {
    return `
        <div class="bookresult card bg-light m-2">
            <div class="card-body d-flex justify-content-between">
                <div class="resultInfo d-flex">
                    <img class="mt-1" src="http://books.google.com/books/content?id=_TEJzgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api" height="100">
                    <div class="resultBasic ms-3">
                        <h4>Title</h4>
                        <h6>Author: author name</h6>
                        <h6>Posted by: username</h6>
                        <h6>Date posted: Date</h6>
                    </div>
                </div>
            </div>
        </div>
    `
};

//*********************** Admin view ****************************/
component.adminScreen = () => {
    return `
    <div class="container my-4">
        <div class="card mb-4">
            <div class="card-header">
                Pending reviews
            </div>
            <div class="card-body overflow-auto" style="max-height: 400px; min-height: 200px" id="pendingReviewoutput">
                
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                Reviews
                <div class="input-group w-50">
                    <input class="form-control" type="text" placeholder="Enter search term..." aria-label="Enter search term..." aria-describedby="button-search" />
                    <button class="btn btn-primary" id="button-search" type="button">Go!</button>
                </div>
            </div>
            
            <div class="card-body" id="review-ctrl">
            </div>

            <div id="review-page">
            </div>
        </div>
    </div>
`;
};

component.adminPendingReview = (review_doc,user_doc) => {
    return `
    <div class="card bg-white my-2">
        <div class="card-body d-flex justify-content-between">
            <div class="d-flex">
                <img class="mt-1" src="${review_doc.data().review_book_thumbnail}" height="120" width="90">
                <div class="resultBasic ms-3">
                    <h5>${review_doc.data().review_title}</h5>
                    <div><b>Book: </b>${review_doc.data().review_book_title}</div>
                    <div><b>Author: </b>${review_doc.data().review_book_authors}</div>
                    <div><b>User:</b> ${user_doc.data().user_name}</div>
                    <div><b>Date posted: </b>${review_doc.data().review_created_date.toDate().toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
                </div>    
            </div>
            <div class="modify-btn d-flex align-items-center flex-column flex-lg-row">
                <button class="btn btn-primary m-1 watch" value="${review_doc.id}"><i class="fa-solid fa-eye" style="width: 18px"></i></button>
                <button class="btn btn-primary m-1 approve" value="${review_doc.id}"><i class="fa-solid fa-check" style="width: 18px"></i></button>
                <button class="btn btn-primary m-1 delete" value="${review_doc.id}"><i class="fa-solid fa-xmark" style="width: 18px"></i></button>
            </div>
        </div>
    </div>`;   
}

component.adminReview = (review_doc, review_creator_name) => {
    return `
    <div class="card bg-white">
        <div class="card-body d-flex justify-content-between">
            <div class="d-flex">
                <img class="mt-1" src="${review_doc.data().review_book_thumbnail}" height="120" width="90">
                <div class="resultBasic ms-3">
                    <h5>${review_doc.data().review_title}</h5>
                    <div><b>Book:</b> Report</div>
                    <div><b>Author:</b> ${review_doc.data().review_creator_id}</div>
                    <div><b>User:</b> username</div>
                    <div><b>Date posted:</b> ${review_doc.data().review_created_date.toDate().toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
                </div>    
            </div>
            <div class="modify-btn ms-1" style="min-width: 150px;">
                <button class="btn btn-primary watch" value="${review_doc.id}"><i class="fa-solid fa-eye" style="width: 18px"></i></button>
                <button class="btn btn-primary update" value="${review_doc.id}"><i class="fa-solid fa-pen-to-square" style="width: 18px"></i></button>
                <button class="btn btn-primary delete" value="${review_doc.id}"><i class="fa-solid fa-xmark" style="width: 18px"></i></button>
            </div>
        </div>
    </div>
    `;
}

//*********************** Footer ****************************/
component.footer = () => {
    return `
    <footer class="py-5 bg-white shadow">
        <div class="container">
            <p class="m-0 text-center">Copyright &copy; Your Website 2023</p>
        </div>
    </footer>
`
};
