const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');

router.get('/books', (req, res) => {
    if(!req.query.key){
        return res.status(401).send('Missing API key');
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send('Invalid API key');
    }
    else{
        bookSchema.find((error, books) => {

            if (error) res.status(500).send('Looks like something went wrong :(')
    
            if (!error) res.send(books);
    
        })
    }
})


router.get('/books/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send('Missing API key');
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send('Invalid API key');
    }
    else{
        bookSchema.findOne({id: req.params.id}, function(error, book){
            if(book == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
            if(error) res.status(500).send('Looks like something went wrong :(')
            if(book != null) res.send(book);
        }) 
    }
})

router.delete('/books/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send('Missing API key');
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send('Invalid API key');
    }
    else{
        bookSchema.findOneAndDelete({id: req.params.id}, function(err, response){
            if(response == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
            if(err) res.status(500).send('Looks like something went wrong :(')
            if(response != null) res.status(204).send()
        });
    }
})

router.post('/books', (req, res) => {
    if(!req.query.key){
        return res.status(401).send('Missing API key');
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send('Invalid API key');
    }
    else{
        if (!req.query.stock ||
            !req.query.ISBN ||
            !req.query.length ||
            !req.query.author ||
            !req.query.category ||
            !req.query.title) {
            return res.status(400).send({ error: 'One or all params are missing. Required params: stock, ISBN, length, author, title, category.' })
        }
        else{
            let newBook = new bookSchema({
                stock: req.query.stock,
                ISBN: req.query.ISBN,
                length: req.query.length,
                author: req.query.author,
                category: req.query.category,
                title: req.query.title
            });
            newBook.save();
            return res.status(201).send('Book added!')
        }
    }
})

router.put('/books', (req, res) => {
    if(!req.query.key){
        return res.status(401).send('Missing API key');
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send('Invalid API key');
    }
    else{
        bookSchema.findOneAndUpdate({id: req.query.id}, req.query, function(error, book){
            if(book == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
            if(error) res.status(500).send('Looks like something went wrong :(')
            if(book != null) res.status(200).send('Book updated!')
        }) 
    }
})

module.exports = router;