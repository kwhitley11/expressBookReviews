const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


function getBookDetailsByISBN(isbn) {
    for (let key in books) {
        if (books[key].isbn === isbn) {
            return books[key];
        }
    }
    return null; // Return null if no book with matching ISBN is found
}

function getBookDetailsByAuthor(author) {
    for (let key in books) {
        if (books[key].author === author) {
            return books[key];
        }
    }
    return null; // Return null if no book with matching author is found
}

function getBookDetailsByTitle(title) {
    for (let key in books) {
        if (books[key].title === title) {
            return books[key];
        }
    }
    return null; // Return null if no book with matching title is found
}

function getBookReviewsByISBN(isbn) {
    for (let key in books) {
        if (books[key].isbn === isbn) {
            return books[key].title + ' ' + JSON.stringify(books[key].reviews);
        }
    }
    return null; // Return null if no book with matching ISBN is found
}


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(getBookDetailsByISBN(isbn));
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    res.send(getBookDetailsByAuthor(author));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    res.send(getBookDetailsByTitle(title));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(getBookReviewsByISBN(isbn));
});

module.exports.general = public_users;
