const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({
                username: username,
                password: password
            });
            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }
    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.trim().toLowerCase();
    const matchingBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );
    if (matchingBooks.length === 0) {
        return res.status(404).json({
            message: "No books found for this author"
        });
    }
    return res.json(matchingBooks);
});

// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.trim().toLowerCase();
    const matchingBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );
    if (matchingBooks.length === 0) {
        return res.status(404).json({
            message: "No books found with this title"
        });
    }
    return res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn].reviews);
});

async function getAllBooksAsync() {
    try {
        const response = await axios.get(
            'http://localhost:5000/'
        );

        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getBookByISBNAsync(isbn) {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getBooksByAuthorAsync(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getBooksByTitleAsync(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}
module.exports.general = public_users;
