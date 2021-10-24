// Function: Spinner Toggling 
// Param: style (string)
const toggleSpinner = style => {
    document.getElementById('spinner').style.display = style;
}

// Hide spinner on first time loading 
toggleSpinner('none');


// When user is clicking the search btn
document.getElementById('search-btn').addEventListener('click', function() {
    // Get search text
    const searchText = getSearchText(); 
    
    // Reset the book showing div
    resetBooksDiv();

    // Checking search text is empty or not
    if(searchText !== '') {
        // Showing spinner
        toggleSpinner('inline-block'); 

        // calling loadData function for api call with search text
        loadData(searchText);
    } else {
        // Search Box is empty
        const text = `Please enter a search value!`;
        // Reseting search box container size
        searchBoxToggleClass('height-lg', 'height-sm');
        // showing search result summary
        searchResultSummary(text);
    }
});


// Function: Getting search box value
// Param: none
const getSearchText = () => {
    // Find search box
    const searchBox = document.getElementById('search-text');
    // Get search box value
    const searchValue = searchBox.value;

    // Return search box value
    return searchValue;
}

// Function: Resetting search box to empty
// Param: none
const resetSearchInput = () => {
    // get search box element
    const searchBox = document.getElementById('search-text');
    // Reset search box value
    searchBox.value = '';
}

// Function: Resetting books div
// Param: none
const resetBooksDiv = () => {
    // get books element
    const books = document.getElementById('books');
    // set books element inner html is equal to empty
    books.innerHTML = '';
}

// Function: Loading data from the api
// Param: searchText (string)
const loadData = searchText => {
    searchResultSummary('');
    // generate dynamic URL
    const URL = `https://openlibrary.org/search.json?q=${searchText}`;
    // fetching data
    fetch(URL)
    .then(response => response.json())
    .then(data => showSearchResult(data, searchText)); // calling showSearchResult function
}


// Function: Showing search result summary
// Param: text (string)
const searchResultSummary = text => {
    // showing text to the search container
    document.getElementById('search-container').innerHTML = text;
}

// Function: Toggle search box
// Param: addClass (class name), removeClass (class name)
const searchBoxToggleClass = (addClass, removeClass) => {
    // Find search box by id
    const searchBox = document.getElementsByClassName('search-box')[0];

    // check if class is already exist or not
    if(!searchBox.classList.contains(addClass)) {
        // if not exist then add class
        searchBox.classList.add(addClass);
        // remove class
        searchBox.classList.remove(removeClass);
    }
}

// Function: Showing search result
// Param: data (object), searchText (string)
const showSearchResult = (data, searchText) => {
    // Checking any result found or not
    if(data.numFound !== 0) { // found
        // Set up dynamic text for search result summary
        const text = `Showing result for '${searchText}'. Total results found ${data.numFound}`;
        // call searchResultSummary function with generated text
        searchResultSummary(text);
        // calling searchBoxToggleClass function for showing small section for search box container
        searchBoxToggleClass('height-sm', 'height-lg');
        // Resetting search input
        resetSearchInput();
    } else { // not found
        // Set up dynamic text for search
        const text = `No results found. Try another one!`;
        // toogle search box with large height
        searchBoxToggleClass('height-lg', 'height-sm');
        // showing search result summary
        searchResultSummary(text);
    }

    // hide spinner
    toggleSpinner('none');
    // reset books div
    resetBooksDiv();

    // find books div element
    const books = document.getElementById('books');

    // iterate through data
    data.docs.forEach(item => {
        const bookDiv = generateNewElement(item);
        // append div to the books element
        books.appendChild(bookDiv);
    })
}

// Function: Generating new book element 
// Param: item (object)
// Return: HTML Element
const generateNewElement = item => {
    // generate div element
    const bookDiv = document.createElement('div');
    // bootstrap col-3 class to generated div
    bookDiv.classList.add('col-md-3', 'col-12');

    const title = (item.title) ? item.title : 'N/A';
    const author = (item.author_name) ? item.author_name[0]: 'N/A';
    const pdate = (item.first_publish_year) ? item.first_publish_year: 'N/A';
    const publisher = (item.publisher) ? item.publisher : 'N/A';

    // generate individual book dynamic card 
    const bookItem = `
                        <div class="card mt-5 w-100"  style="width: 18rem;">
                            <img class="card-img-top" height="300px" src="https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <small class="text-muted author">Author: ${author}</small>
                                <small class="text-muted publish">Publisher: ${publisher}</small>
                                <small class="text-muted publish">Publishing Date: ${pdate}</small>
                            </div>
                        </div>
                    `

    // push generated dynamic card
    bookDiv.innerHTML = bookItem;

    // Returning
    return bookDiv;
}