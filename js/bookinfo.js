
  const getbookisbn = document.getElementById('getbook')
console.log(getbookisbn)
getbookisbn.addEventListener('submit', (e) => {
    e.preventDefault()
    isbn = document.getElementById('bookisbn').value
    var url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
    var response = UrlFetchApp.fetch('http://www.google.com/');
    var results = JSON.parse(response);
  
    if (results.totalItems) {
      // There'll be only 1 book per ISBN
      var book = results.items[0];
  
      var title = book['volumeInfo']['title'];
      var subtitle = book['volumeInfo']['subtitle'];
      var authors = book['volumeInfo']['authors'];
      var printType = book['volumeInfo']['printType'];
      var pageCount = book['volumeInfo']['pageCount'];
      var publisher = book['volumeInfo']['publisher'];
      var publishedDate = book['volumeInfo']['publishedDate'];
      var webReaderLink = book['accessInfo']['webReaderLink'];
  
      // For debugging
      logger.log(book);
    }
})