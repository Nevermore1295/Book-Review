
export const book = {};

book.addingParameter = (first, url, param, value, preceedChar) => {
    if (value !== null) {
        if (!first) {
            url += preceedChar;
        } else {
            first = 0;
        }
        url = url + param + value;
    }

    return [first, url];
};

book.searchBookByName = async (booktitle = null, author = null, isbn = null, maxResults = 5)=>{
    try {
        var searchResults = [];
        var url = 'https://www.googleapis.com/books/v1/volumes?q=';
        var first = 1;

        [first, url] = book.addingParameter(first, url, 'isbn:', isbn, '+');
        [first, url] = book.addingParameter(first, url, 'title:', booktitle, '+');
        [first, url] = book.addingParameter(first, url, 'author:', author, '+');
        [first, url] = book.addingParameter(first, url, 'maxResults=', maxResults, '&');
        
        console.log(url);

        var response = await fetch(url)
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(error);
                return null;
            });
        var results = await response.json();
        console.log(results);
        for (let book_id = 0; book_id < Math.min(results.totalItems, 5); book_id++) {
            let data = {};

            if (results.items[book_id].volumeInfo === undefined) {
                console.error("A books without a volume info: ", console.log(url));
            } 
            
            var attributes = ["title", "authors", "publishedDate","imageLinks","industryIdentifiers"]; 
            for (var index = 0; index < attributes.length; index++) {
                if (results.items[book_id].volumeInfo[attributes[index]] === undefined) {
                    continue;
                }
                data[attributes[index]] = results.items[book_id].volumeInfo[attributes[index]]; 
                
            }
            attributes.push("id");
            data.id = results.items[book_id].id;
            
            // co
            // data.thumbnail = results.items[book_id].volumeInfo.imageLinks.thumbnail;
            searchResults.push(data);
        }
        return searchResults;
    } catch(err) {
        console.log(err);
    }
}

book.resolveQuery= async(data) => {
    var list = [];
    var isbnSearch = await book.searchBookByName(null, null, data);
    var nameSearch = await book.searchBookByName(data, null, null, 5 - isbnSearch.length);
    for (var isbnIndex = 0; isbnIndex < isbnSearch.length; isbnIndex++) {
        list.push(isbnSearch[isbnIndex]);
    }
    for (var nameIndex = 0; nameIndex < nameSearch.length; nameIndex++) {
        list.push(nameSearch[nameIndex]);
    }
    return list;
}

book.searchBookByID = async (id) => {
    var response = await fetch('https://www.googleapis.com/books/v1/volumes/'+id)
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(error);
                return null;
            });
    var results = await response.json();
    console.log(results);
}