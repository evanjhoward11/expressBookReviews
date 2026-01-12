const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
let valid = users.filter((user) => {
    if (user.username === username) {
        return true;
    }
    else {
        return false;
    }
});
    return valid.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let valid = users.filter((user) => {
    if (user.username === username && user.password === password) {
        return true;
    }
    else {
        return false;
    }
});
    return valid.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
      // Generate JWT Access Token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      };
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let review = req.query.review;
    const username = req.session.authorization.username;
  
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get username from session
  
    if (books[isbn]) {
        let book = books[isbn];
        // Check if the user has a review for this book
        if (book.reviews[username]) {
            delete book.reviews[username]; // Delete only this user's review
            return res.status(200).send(`Review for ISBN ${isbn} posted by user ${username} deleted.`);
        } else {
            return res.status(404).json({message: "No review found for this user on this book"});
        }
    } else {
        return res.status(404).json({message: "Book not found"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
