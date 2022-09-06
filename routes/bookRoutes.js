const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');

router.get('/books', (req, res) => {
    bookSchema.find((error, books) => {

        if (error) res.send(404);

        if (!error) res.send(books);

    })
})


router.get('/books/:id', (req, res) => {

})

router.delete('/books/delete/:id', (req, res) => {
    bookSchema.findOneAndDelete({id: req.params.id}, function(err, response){
        if(response == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
        if(err) res.status(500).send('Looks like something went wrong :(')
    });
})

router.post('/books', (req, res) => {
    if (!req.query.stock ||
        !req.query.ISBN ||
        !req.query.length ||
        !req.query.author ||
        !req.query.title) {
        return res.status(400).send({ error: 'One or all params are missing. Required params: stock, ISBN, length, author, title.' })
    }
    else{
        let newBook = new bookSchema({
            stock: req.query.stock,
            ISBN: req.query.ISBN,
            length: req.query.length,
            author: req.query.author,
            title: req.query.title
        });
        newBook.save();
        return res.status(201).send('Book added!')
    }
})

router.put('/books/:id', (req, res) => {

})

module.exports = router;