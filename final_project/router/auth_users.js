const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return user.username === username &&
               user.password === password;
    });

    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.status(404).json({
            message: "Error logging in"
        });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data: password},"access",{expiresIn: 60 * 60}
        );
        req.session.authorization = {
            accessToken,
            username
        };
        return res.status(200).send(
            "User successfully logged in"
        );
    } else {
        return res.status(208).json({
            message: "Invalid Login. Check username and password"
        });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization["username"];
    books[isbn].reviews[username] = review;
    return res.status(200).send(
        `The review for the book with ISBN ${isbn} has been added/updated successfully`
    );
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization["username"];
    if (books[isbn] && books[isbn].reviews[username]) {

        delete books[isbn].reviews[username];

        return res.status(200).send(
            `The review for the book with ISBN ${isbn} has been deleted successfully`
        );
    }
    return res.status(404).send(
        "Review not found"
    );
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
