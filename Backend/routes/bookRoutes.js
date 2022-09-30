const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');
const loanSchema = require('../models/loan');
const reviewSchema = require('../models/review');
const multer = require("multer");
const fs = require("fs");
const utlis = require('../utils/utils')
const bookDTO = require('../models/DTOs/bookDTO');
const utils = require('../utils/utils');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/bookCovers');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadBookCover = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/books', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        bookSchema.find((error, books) => {

            if (error) return res.status(500).send({ error: 'Looks like something went wrong :(' })

            if (!error) return res.send(utils.convertBook(books));

        })
    }
})


router.get('/books/:id', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        bookSchema.findOne({ _id: req.params.id }, function (error, book) {
            if (book == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
            if (error) return res.status(500).send({ error: 'Looks like something went wrong :(' })
            if (book != null) return res.send(bookDTO(book));
        })
    }
})

router.get('/books/author/:author', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        bookSchema.find({ author: req.params.author }, function (error, books) {
            if (books.length == 0) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
            if (error) return res.status(500).send({ error: 'Looks like something went wrong :(' })
            if (books != null) return res.send(utils.convertBook(books));
        })
    }
})

router.get('/books/genre/:genre', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        bookSchema.find({ genre: req.params.genre }, function (error, books) {
            if (books.length == 0) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
            if (error) return res.status(500).send({ error: 'Looks like something went wrong :(' })
            if (books != null) return res.send(utils.convertBook(books));
        })
    }
})

router.get('/books/search/:keyword', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        bookSchema.find({
            "$or": [
                { title: { '$regex': req.params.keyword, '$options': 'i' } },
                { author: { '$regex':req.params.keyword, '$options': 'i' } },
                { ISBN: req.params.keyword }
            ]
        }).then((books) => {
            res.send(utils.convertBook(books))
        });
    }
})

router.delete('/books/:id', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        loanSchema.findOne({book: req.params.id}, function (err, loans){
            if(loans != null) return res.status(400).send({ error: "Can't delete a book with active loans." });
            else{
                bookSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
                    if (response == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
                    if (err) return res.status(500).send({ error: 'Looks like something went wrong :(' })
                    if (response != null) {
                        if(response.localImgPath != null){
                            fs.unlink(response.localImgPath, (err => {
                                if (err) {
                                    return res.status(500).send({ error: 'Looks like something went wrong :(' })
                                }
                            }))
                        }
                        reviewSchema.deleteMany({book: req.params.id}, function(err, deletedReviews){})
                        return res.status(204).send()
                    }
                });
            }
        })
        
    }
})

router.post('/books', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        if (!req.query.stock ||
            !req.query.ISBN ||
            !req.query.length ||
            !req.query.author ||
            !req.query.genre ||
            !req.query.description ||
            !req.query.publicationDate ||
            !req.query.title) {
            return res.status(400).send({ error: 'One or all params are missing. Required params: stock, ISBN, length, author, title, genre, description, publicationDate, coverImg (must be .jpeg, .png, .webp or .jpg).' })
        }
        else {
            let upload = uploadBookCover.single('coverImg');
            upload(req, res, function (err) {
                if (err) {
                    return res.status(400).send({ error: 'Invalid parameter name for file upload. Valid parameters for files: coverImg' })
                }
                else {
                    if (!req.file) return res.status(400).send({ error: 'Invalid file type or missing coverImg parameter. File must be .jpeg, .png, .webp or .jpg' })
                    let imgSourceString = (req.protocol + '://' + req.get('host') + '/' + req.file.path).replaceAll("\\", "/").replace('/data', "");
                    let newBook = new bookSchema({
                        stock: req.query.stock,
                        ISBN: req.query.ISBN,
                        length: req.query.length,
                        author: req.query.author,
                        genre: req.query.genre,
                        title: req.query.title,
                        imgSource: imgSourceString,
                        localImgPath: req.file.path,
                        description: req.query.description,
                        publicationDate: req.query.publicationDate
                    });
                    newBook.save();
                    return res.status(201).send('Book added!')
                }
            })
        }
    }
})

router.put('/books/:id', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send('Missing API key');
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send('Invalid API key');
    }
    else {
        if(!req.params.id) return res.status(400).send({ error: 'Missing id parameter.' })
        let upload = uploadBookCover.single('coverImg');
            upload(req, res, function (err) {
                if(err) return res.status(400).send({ error: 'Invalid parameter name for file upload. Valid parameters for files: coverImg' })
                    bookSchema.findOneAndUpdate({ _id: req.params.id }, req.query, function (error, book) {
                        if (book == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
                        if (error) return res.status(500).send({ error: 'Looks like something went wrong :(' })
                        if(!req.file && !req.query) {return res.status(400).send({ error: 'No given params. Valid params: stock, ISBN, length, author, title, genre, description, publicationDate, coverImg (must be .jpeg, .png, .webp or .jpg).' })}  
                        if (req.file){
                            fs.unlink(book.localImgPath, (err => {
                                if (err) {
                                    return res.status(500).send({ error: 'Looks like something went wrong :(' })
                                }
                            }))
                            let imgSourceString = (req.protocol + '://' + req.get('host') + '/' + req.file.path).replaceAll("\\", "/").replace('/data', "");
                            book.imgSource = imgSourceString
                            book.localImgPath = req.file.path
                            book.save();
                        }
                        if (book != null) return res.status(200).send('Book updated!')
                    })                   
            })
    }
})


module.exports = router;