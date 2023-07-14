export const component = {};

component.navbarUsername = 
` 
    <div class="d-flex align-content-center me-1">
        <div class="dropdown">
            <i class="navbar-nav ms-auto fa-solid fa-user" type="button" data-bs-toggle="dropdown" style="font-size:25px" >
            </i>
            <ul class="dropdown-menu account-dropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" id="log-out">Log Out</a></li>
            </ul>
        </div>
    </div>
`

component.navbarLoginForm = `
<div class="d-flex align-content-center me-1">
    <div class="dropdown">
    <!-- Button trigger modal -->
    <i type="button" class="navbar-nav ms-auto fa-solid fa-user" data-bs-toggle="modal" data-bs-target="#LoginModal" style="font-size:25px"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
        </ul>
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

component.navbar = `
    <nav class="header navbar navbar-expand-lg shadow navbar-light bg-white">
        <div class="container">
            <a class="navbar-brand" id="navbar-brand">BookReview</a>
            <button class="navbar-toggler button-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto">
                    <li class="dropdown">
                        <a id="home">Home</a>
                    </li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Collections
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a id="search-btn">Search</a>
                    </li>  
                    <li class="dropdown">
                        <a id="about-btn">About</a>
                    </li>
                    <li class="dropdown">
                        <a id="review-btn">Make a review</a>
                    </li>
                </ul>
                <a id="user-auth">
                </a>
            </div>
        </div>
    </nav>
`;

component.header = `
    <header class="py-5 bg-light border-bottom mb-4">
        <div class="container">
            <div class="text-center my-5">
                <h1 class="fw-bolder">Welcome to Blog Home!</h1>
                <p class="lead mb-0">A Bootstrap 5 starter layout for your next blog homepage</p>
            </div>
        </div>
    </header>
`;

component.sideWidget = `
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
                    <div class="col-sm-6">
                        <ul class="list-unstyled mb-0">
                            <li><a href="#!">Web Design</a></li>
                            <li><a href="#!">HTML</a></li>
                            <li><a href="#!">Freebies</a></li>
                        </ul>
                    </div>
                    <div class="col-sm-6">
                        <ul class="list-unstyled mb-0">
                            <li><a href="#!">JavaScript</a></li>
                            <li><a href="#!">CSS</a></li>
                            <li><a href="#!">Tutorials</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
`

//**********************Home Screen***********************
component.blogEntries = `
<!-- Featured blog post-->
<div class="card mb-4">
    <a class="reviewScreen"><img class="card-img-top" src="https://dummyimage.com/850x350/dee2e6/6c757d.jpg" alt="..." /></a>
    <div class="card-body">
        <div class="small text-muted">January 1, 2023</div>
        <h2 class="card-title">Featured Post Title</h2>
        <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis aliquid atque, nulla? Quos cum ex quis soluta, a laboriosam. Dicta expedita corporis animi vero voluptate voluptatibus possimus, veniam magni quis!</p>
        <a class="btn btn-primary" class="reviewScreen">Read more →</a>
    </div>
</div>
<!-- Nested row for non-featured blog posts-->
<div class="row">
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

component.homeContent = `
    <!-- Page content-->
    <div class="container">
        <div class="row">
            <!-- Blog entries-->
            <div class="col-lg-8">
                <div id="featured-post">
                
                </div>
                <div class="row d-flex" id="review-posts"> 
                
                </div>
                </script>



                <!-- Pagination-->
                <nav aria-label="Pagination">
                    <hr class="my-0" />
                    <ul class="pagination justify-content-center my-4">
                        <li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Newer</a></li>
                        <li class="page-item active" aria-current="page"><a class="page-link" href="#!">1</a></li>
                        <li class="page-item"><a class="page-link" href="#!">2</a></li>
                        <li class="page-item"><a class="page-link" href="#!">3</a></li>
                        <li class="page-item disabled"><a class="page-link" href="#!">...</a></li>
                        <li class="page-item"><a class="page-link" href="#!">15</a></li>
                        <li class="page-item"><a class="page-link" href="#!">Older</a></li>
                    </ul>
                </nav>
            </div>
            ${component.sideWidget}
        </div>
    </div>
`;


//**********************Review Screen***********************
component.reviewInfo = `
    <!-- Post content-->
    <article>
        <!-- Post header-->
        <header class="mb-4">
            <!-- Post title-->
            <h1 class="fw-bolder mb-1">Welcome to Blog Post!</h1>
            <!-- Post meta content-->
            <div class="text-muted fst-italic mb-2">Posted on January 1, 2023 by Start Bootstrap</div>
            <!-- Post categories-->
            <a class="badge bg-secondary text-decoration-none link-light" href="#!">Web Design</a>
            <a class="badge bg-secondary text-decoration-none link-light" href="#!">Freebies</a>
        </header>
        <!-- Preview image figure-->
        <figure class="mb-4"><img class="img-fluid rounded" src="https://dummyimage.com/900x400/ced4da/6c757d.jpg" alt="..." /></figure>
        <!-- Post content-->
        <section class="mb-5">
            <p class="fs-5 mb-4">Science is an enterprise that should be cherished as an activity of the free human mind. Because it transforms who we are, how we live, and it gives us an understanding of our place in the universe.</p>
            <p class="fs-5 mb-4">The universe is large and old, and the ingredients for life as we know it are everywhere, so there's no reason to think that Earth would be unique in that regard. Whether of not the life became intelligent is a different question, and we'll see if we find that.</p>
            <p class="fs-5 mb-4">If you get asteroids about a kilometer in size, those are large enough and carry enough energy into our system to disrupt transportation, communication, the food chains, and that can be a really bad day on Earth.</p>
            <h2 class="fw-bolder mb-4 mt-5">I have odd cosmic thoughts every day</h2>
            <p class="fs-5 mb-4">For me, the most fascinating interface is Twitter. I have odd cosmic thoughts every day and I realized I could hold them to myself or share them with people who might be interested.</p>
            <p class="fs-5 mb-4">Venus has a runaway greenhouse effect. I kind of want to know what happened there because we're twirling knobs here on Earth without knowing the consequences of it. Mars once had running water. It's bone dry today. Something bad happened there as well.</p>
        </section>
    </article>
`
component.displayedParentComment=`
<div class="d-flex mb-4">
    <!-- Parent comment-->
    <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
    </div>
    <div class="ms-3">
        <div class="fw-bold">
            Commenter Name
        </div>
        If you're going to lead a space frontier, it has to be government; it'll never be private enterprise. Because the space frontier is dangerous, and it's expensive, and it has unquantified risks.
        <!-- Child comment 1-->
        <div class="d-flex mt-4">
            <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
            </div>
            <div class="ms-3">
                <div class="fw-bold">
                    Commenter Name
                </div>
                And under those conditions, you cannot establish a capital-market evaluation of that enterprise. You can't get investors.
            </div>
        </div>
        <!-- Child comment 2-->
        <div class="d-flex mt-4">
            <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
            </div>
            <div class="ms-3">
                <div class="fw-bold">
                    Commenter Name
                </div>
                When you put money directly to a problem, it makes a good headline.
            </div>
        </div>
    </div>
</div>
`

component.displayedChildComment=`
    <!-- Single comment-->
    <div class="d-flex">
        <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." /></div>
        <form class="ms-3">
            <div class="fw-bold">Commenter Name</div>
            And under those conditions, you cannot establish a capital-market evaluation of that enterprise. You can't get investors.
        </div>
    </div>
`

component.commentSection = `
    <!-- Comments section-->
    <section class="mb-5">
        <div class="card bg-light">
            <div class="card-body">
                <!-- Comment form-->
                <form class="mb-4 d-flex" id="comment" >
                    <input class="form-control" id="comment-content" rows="3" placeholder="Join the discussion and leave a comment!">
                    </input>
                    <button class="btn btn-block btn-lg btn-primary">
                        Submit
                    </button>
                </form>
                <a id="comment-section">

                </a>
            </div>
        </div>
    </section>
`

component.reviewContent = `
    <!-- Page content-->
    <div class="container mt-5">
        <div class="row">
            <div class="col-lg-8">
                ${component.reviewInfo}
                ${component.commentSection}
            </div>
            ${component.sideWidget}
        </div>
    </div>
`;


//**********************Register Screen***********************
component.blankNavbar = `
    <div class="navbar navbar-expand-lg navbar-light bg-white shadow">
        <div class="container">
            <a class="navbar-brand" id="navbar-brand">BookReview</a>
        </div>
    </div>
`;


component.registerContent = `
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
                                    <a href="#!" class="fw-bold text-body"><u>Login here</u></a>
                                </div>                    
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
`;

//**********************Reviewscreen***********************

component.bookSearch = `
    <div class="container my-4"> 
        <h2 class="card-title m-2">Make your review</h2>
            <form class="input-group input-group-lg p-4">
                <input type="text" class="form-control" placeholder="ISBN / Book's title" ">
                <div class="input-group-append">
                    <button class="btn btn-primary btn-lg" type="button">Search</button>
                </div>
            </form>
            <div class="card">
                <div class="card-body overflow-auto bg-white" style="height: 300px">
                    <div class="bookresult card bg-light m-2">
                        <div class="card-body d-flex justify-content-between">
                            <div class="resultInfo d-flex">
                                <img class="mt-1" src="http://books.google.com/books/content?id=_TEJzgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api" height="100">
                                <div class="resultBasic ms-3">
                                    <h4>Title</h4>
                                    <h6>Author: author name</h6>
                                    <h6>Publisher: publisher name</h6>
                                    <h6>Date published: date published</h6>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">        
                                    <button class="btn btn-outline-primary" onclick="document.getElementById('Review').scrollIntoView({behavior: 'smooth'});" type="button">Review</button>
                            </div>
                        </div>
                    </div>
                    <div class="bookResult card bg-light m-2">
                        <div class="card-body d-flex justify-content-between">
                            <div class="resultInfo d-flex">
                                <img class="mt-1" src="http://books.google.com/books/content?id=_TEJzgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api" height="100">
                                <div class="resultBasic ms-3">
                                    <h4>Title</h4>
                                    <h6>Author: author name</h6>
                                    <h6>Publisher: publisher name</h6>
                                    <h6>Date published: date published</h6>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">        
                                <button class="btn btn-outline-primary" onclick="document.getElementById('Review').scrollIntoView({behavior: 'smooth'});" type="button">Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card review-form mt-3">
                <div class="card-body d-flex">
                    <img  src="http://books.google.com/books/content?id=_TEJzgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" style="height:160px"> 
                    <div class="book-info ms-3 w-100">
                        <div class="input-group input-group-sm mb-3 w-100">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Book title</span>
                            </div>
                            <input type="text" class="form-control" aria-describedby="basic-addon1" disabled value="Book name">
                        </div>
                        <div class="row">
                            <div class="input-group input-group-sm mb-3 me-1 col float-start">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Author</span>
                                </div>
                                <input type="text" class="form-control" aria-describedby="basic-addon1" disabled value="Author name">
                            </div>
                            <div class="input-group input-group-sm mb-3 col">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Publisher</span>
                                </div>
                                <input type="text" class="form-control" aria-describedby="basic-addon1" disabled value="Publisher">
                            </div>
                        </div>
                        <div class="input-group input-group-sm mb-3 w-50">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Date published</span>
                            </div>
                            <input type="text" class="form-control" aria-describedby="basic-addon1" disabled value="1/1/1970">
                        </div>
                   
                    <form id="Review">
                        <h6>Review Title</h6>
                        <textarea class="form-control mb-2" id="Review-title" rows="1"></textarea>

                        <h6>Review</h6>
                        <textarea class="form-control mb-2" id="Review-content" rows="6"></textarea>
                        <button class="btn btn-lg btn-primary float-end me-2" > Submit </button>
                    <form>
                    </div>
                    
                </div>
            </div>
    </div>
`;


//*********************** Search review ****************************/

component.reviewQuery =`
    <div class="container my-4">
        <h2 class="card-title m-2">Find reviews</h2>
        <form class="input-group input-group-lg p-4">
                <input type="text" class="form-control" placeholder="Book's title" ">
                <div class="input-group-append">
                    <button class="btn btn-primary btn-lg" type="button">Search</button>
                </div>
        </form>
        <div class="card">
                <div class="card-body overflow-auto bg-white" style="height: 600px">
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
                    <div class="bookResult card bg-light m-2">
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
                </div>
            </div>
        </div>
    </div>
`;


//*********************** Admin view ****************************/
component.adminScreen = `
${component.homeContent}
`;
//*********************** Footer ****************************/
component.footer = `
    <footer class="py-5 bg-white shadow">
        <div class="container">
            <p class="m-0 text-center">Copyright &copy; Your Website 2023</p>
        </div>
    </footer>
`;
