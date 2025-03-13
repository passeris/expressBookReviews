const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();
let users = require("./auth_users.js").users;


// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let index = -1
    const isbn = parseInt(req.params.isbn);

    for (let key in books) {  
        if(isbn == key) {
            index = key;
        }
        else {
            console.log("searching...");
        }

    }
    if(index >= 0) {
        res.send(JSON.stringify(books[index],null,"\t"));
    }
    else {
        // Return error if book could not be found
        return res.status(404).json({message: "Book not found."});
    }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let found = false;
    let key = -1;
    const author = req.params.author;
    let booksByAuthor = [];

    for (let key in books) {  
        if(author == books[key].author) {
            index = key;
            booksByAuthor.push(books[key]);
            found = true;
        }
    }
    if(found === true) {
        res.send(JSON.stringify(booksByAuthor,null,"\t"));
    }
    else {
        // Return error if book could not be found
        return res.status(404).json({message: "Book not found."});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let found = false;
    let index = -1;
    let booksByTitle = [];
    const title = req.params.title;

    for (let key in books) {  
        if(title == books[key].title) {
            booksByTitle.push(books[key]);
            found = true;
        }
    }
    if(found === true) {
        res.send(JSON.stringify(booksByTitle,null,"\t"));
    }
    else {
        // Return error if book could not be found
        return res.status(404).json({message: "Book not found."});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let found = false;
    let index = -1;
    let bookReviews = {};
    const isbn = parseInt(req.params.isbn);

    for (let key in books) {  
        if(isbn == key) {
            bookReviews = books[key].reviews;
            found = true;
        }
    }
    if(found === true) {
        res.send(bookReviews);
    }
    else {
        // Return error if book could not be found
        return res.status(404).json({message: "Book not found."});
    }
});

module.exports.general = public_users;
