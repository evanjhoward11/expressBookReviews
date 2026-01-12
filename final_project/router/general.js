const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user already exists
  const existingUsers = users.filter((user) => user.username === username);

  if (existingUsers.length > 0) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  // Register the new user
  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulating an asynchronous operation (like fetching from a DB)
      const getBooks = new Promise((resolve, reject) => {
          resolve(books);
      });
  
      const bookList = await getBooks;
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
      return res.status(500).json({message: "Error fetching book list"});
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    try {
      // Simulating an asynchronous operation (like fetching from a DB)
      const getBook = new Promise((resolve, reject) => {
          resolve(books[isbn]);
      });
  
      const book = await getBook;
      return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
      return res.status(404).json({message: error});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;

  try {
    const fetchByAuthor = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filteredBooks = [];
        keys.forEach(key => {
            if (books[key].author === author) {
                filteredBooks.push(books[key]);
            }
          });

          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject("No books found for this author");
          }
        });
        const result = await fetchByAuthor;
        return res.status(200).send(JSON.stringify(result, null, 4));  }
 catch {
    return res.status(404).json({message: error});
}
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;

  try {
    const fetchByTitle = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const filteredBooks = [];

        keys.forEach(key => {
            if (books[key].title === title) {
                filteredBooks.push(books[key]);
            }
          });

          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject("No books found for this title");
          }
    });
    const result = await fetchByTitle;
    return res.status(200).send(JSON.stringify(result, null, 4)); 
  }
  catch {
    return res.status(404).json({message: error});
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});


module.exports.general = public_users;
