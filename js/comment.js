
const storage = getStorage();

const commentForm = document.getElementById('comment');
console.log(commentForm);
console.log(auth);
commentForm.addEventListener('submit', async (cf) =>{
    cf.preventDefault();
    // Get comment content
        const commentContent = document.getElementById('comment-content').value;
        console.log(commentContent);

    // Get user info that is working
        // const q = query(collection(db, 'user'), where('user_id', '==', currentUserId))
        // const d = doc(q);
    
    //Create data firestore 
        const initialData = {
            comment_creator_id: auth.currentUser.uid,
            comment_content: commentContent,
            comment_created_date: Date(cf)
        }
    
    //Add data to doc
        const docRef = await addDoc(collection(db, 'Comment'),initialData).then(() => {
            // Reset form
            commentForm.reset()
        }).catch(err => {
            // Catch error
            console.log(err.message)
        })
        console.log(`User ${auth.currentUser.displayName} successfully comment`);
})



