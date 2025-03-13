const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let index = -1
    const isbn = parseInt(req.params.isbn);
    const theReview = req.query.review;
    const user = req.session.authorization.username;

    let book = books[isbn];  // Retrieve book object associated with ISBN
    if (book) {  // Check if book exists
            book.reviews[user] = theReview;
    }
    else {
        // Respond if book with specified ISBN is not found
        res.send("Unable to find book with ISBN ", isbn);
    }
    res.send(`Review added to book.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const user = req.session.authorization.username;
    let book = books[isbn];  // Retrieve book object associated with ISBN
    if (book.reviews[user]) {  // Check if book exists
             delete book.reviews[user];
    }
    else {
        // Respond if book with specified ISBN is not found
        res.send("Unable to find review with ISBN ", isbn, " for the user ", user);
    }
    res.send("Book review by user ", user, " was deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
