const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


function getBookDetailsByISBN(isbn) {
    for (let key in books) {
        if (books[key].isbn === isbn) {
            return books[key];
        }
    }
    return null; // Return null if no book with matching ISBN is found
}


let users = [];



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }  
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const username = req.query.username;
    const isbn = req.query.ISBN;
    const book = getBookDetailsByISBN(isbn);

    if (!username) {
        return res.status(401).send('Unauthorized');
    }
    if (!isbn || !review) {
        return res.status(400).send('ISBN and review are required');
    }

     // Check if user has already posted a review for the same ISBN
     if (book.reviews[username]) {
        // Modify existing review
        book.reviews = review;
        res.send(`Review modified for ISBN ${isbn}`);
    } else {
        // Add new review
        if (!book) {
            book = {};
        }
        book.reviews = review;
        res.send(`New review added for ISBN ${isbn}`);
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.query.ISBN;
    const bookByISBN = getBookDetailsByISBN(isbn);
    const username = req.query.username;

    if (bookByISBN.reviews[username]) {
        delete bookByISBN.reviews[username];
        res.send(`Book review deleted for ${bookByISBN.title}.`)
    } else {
        res.status(400).send('Book not found.')
    }
        })



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
