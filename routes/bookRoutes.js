const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');

// Get all books

router.get('/books', (req, res) => {
    bookSchema.find((error, books) => {

        if(error) res.send(404);

        if(!error) res.send(books);

    })
})

// Get a book by id

router.get('/books/:id', (req, res) => {
    
})

// Create a book

router.post('/books', (req, res) => {
    let newBook = new bookSchema({
        stock: 0,
        ISBN: "123",
        length: 123
    });
    newBook.save();
})

// Update a book

router.put('/books/:id', (req, res) => {

})

module.exports = router;