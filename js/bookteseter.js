const tester = document.getElementById('test');
console.log(tester);
tester.addEventListener('submit', (e) => {
    e.preventDefault();
    resolveQuery(document.getElementById('bookdata').value)
    tester.reset();  
})   

addingParameter = (first, url, param, value, preceedChar) => {
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

searchBookByName = async (title = null, author = null, isbn = null, maxResults = 5)=>{
    try {
        var searchResults = [];
        var url = 'https://www.googleapis.com/books/v1/volumes?q=';
        var first = 1;

        [first, url] = addingParameter(first, url, 'isbn:', isbn, '+');
        [first, url] = addingParameter(first, url, 'title:', title, '+');
        [first, url] = addingParameter(first, url, 'author:', author, '+');
        [first, url] = addingParameter(first, url, 'maxResults=', maxResults, '&');
        
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
        for (let book_id = 0; book_id < Math.min(results.totalItems, 5); book_id++) {
            let data = {};

            if (results.items[book_id].volumeInfo === undefined) {
                console.error("A books without a volume info: ", console.log(url));
            } 
            
            var attributes = ["title", "authors", "categories", "industryIdentifiers", "thumbnail"]; 
            for (var index = 0; index < attributes.length; index++) {
                if (results.items[book_id].volumeInfo[attributes[index]] === undefined) {
                    continue;
                }
                data[attributes[index]] = results.items[book_id].volumeInfo[attributes[index]]; 
            }
            searchResults.push(data);
        }
        return searchResults;
    } catch(err) {
        console.log(err);
    }
}

resolveQuery= async(data) => {
    var list = [];
    var isbnSearch = (await searchBookByName(null, null, data));

    var nameSearch = (await searchBookByName(data, null, null, 5 - isbnSearch.length));
    for (var isbnIndex = 0; isbnIndex < isbnSearch.length; isbnIndex++) {
        list.push(isbnSearch[isbnIndex]);
    }
    for (var nameIndex = 0; nameIndex < nameSearch.length; nameIndex++) {
        list.push(nameSearch[nameIndex]);
    }
    console.log(list[0]);
    return list;
}