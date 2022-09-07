const express = require('express');
const router = express.Router();
const loanSchema = require('../models/loan');
const bookSchema = require('../models/book');
const userSchema = require('../models/user');

router.get('/loans', (req, res) => {
    loanSchema.find((error, loans) => {

        if (error) res.status(500).send('Looks like something went wrong :(')

        if (!error) res.send(loans);

    })
})

router.get('/loans/:id', (req, res) => {
    loanSchema.findOne({id: req.params.id}, function(error, loan){
        if(loan == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
        if(error) res.status(500).send('Looks like something went wrong :(')
        if(loan != null) res.send(loan);
    }) 
})


router.post('/loans', (req, res) => {
    if (!req.query.loanStart ||
        !req.query.loanEnd ||
        !req.query.userId ||
        !req.query.bookId ) {
        return res.status(400).send({ error: 'One or all params are missing. Required params: loanStart, loanEnd, userId, bookId' })
    }
    else{
        userSchema.findOne({id: req.query.userId}, function (error, user){
            if(user == null) return res.status(404).send("Looks like we couldn't find the user you were looking for.")
            if(error) return res.status(500).send('Looks like something went wrong :(')
            bookSchema.findOne({id: req.query.bookId}, function(error, book){
                if(book == null) return res.status(404).send("Looks like we couldn't find the book you were looking for.")
                if(error) return res.status(500).send('Looks like something went wrong :(')
                let newLoan = new loanSchema({
                    loanStart: req.query.loanStart,
                    loanEnd: req.query.loanEnd,
                    user: user,
                    book: book
                });
                newLoan.save();
                return res.status(201).send('Loan added!')
            })
        })  
    }
})


router.put('/loans', (req, res) => {
    loanSchema.findOneAndUpdate({id: req.query.id}, req.query, function(error, loan){
        if(loan == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
        if(error) res.status(500).send('Looks like something went wrong :(')
        if(loan != null) res.status(200).send('Loan updated!')
    }) 
})

router.delete('/loans/delete/:id', (req, res) => {
    loanSchema.findOneAndDelete({id: req.params.id}, function(err, response){
        if(response == null) res.status(404).send("Looks like we couldn't find what you were looking for.")
        if(err) res.status(500).send('Looks like something went wrong :(')
        if(response != null) res.status(204).send()
    });
})

module.exports = router;