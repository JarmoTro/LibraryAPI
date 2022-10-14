const express = require('express');
const router = express.Router();
const loanSchema = require('../models/loan');
const bookSchema = require('../models/book');
const userSchema = require('../models/user');
const utils = require('../utils/utils');
const loanDTO = require('../models/DTOs/loanDTO')
const { default: mongoose } = require('mongoose');


router.get('/loans', (req, res) => {
    if (utils.checkAPIKey(req.query.key,res)) {
        loanSchema.aggregate([
            {$lookup: {from: "books", localField: "book", foreignField:"_id", as:"book"}}
        ]).exec(function(error, loans){

            if (error) res.status(500).send('Looks like something went wrong :(')
    
            if (!error) res.send(utils.convertLoan(loans));
    
        })
    }
})

router.get('/loans/user/:id', (req, res) => {
    if (utils.checkAPIKey(req.query.key,res)) {
        loanSchema.aggregate([
            {$match: {user: mongoose.Types.ObjectId(req.params.id)}},
            {$lookup: {from: "books", localField: "book", foreignField:"_id", as:"book"}}
        ]).exec(function(error, loans){
            if(loans == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(loans != null) return res.send(utils.convertLoan(loans))
        })
    }
})

router.get('/loans/:id', (req, res) => {
    if (utils.checkAPIKey(req.query.key,res)) {
        loanSchema.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
            {$lookup: {from: "books", localField: "book", foreignField:"_id", as:"book"}}
        ]).exec(function(error, loan){
            if(loan == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(loan != null) return res.send(utils.convertLoan(loan))
        }) 
    }
})


router.post('/loans', (req, res) => {
    if (utils.checkAPIKey(req.body.key,res)) {
        if (!req.body.loanStart ||
            !req.body.loanEnd ||
            !req.body.user ||
            !req.body.book ) {
            return res.status(400).send({ error: 'One or all params are missing. Required params: loanStart, loanEnd, user, book' })
        }
        else{
            userSchema.findOne({_id: req.body.user}, function (error, user){
                if(user == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                bookSchema.findOne({_id: req.body.book}, function(error, book){
                    if(book == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                    if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                    let newLoan = new loanSchema({
                        loanStart: req.body.loanStart,
                        loanEnd: req.body.loanEnd,
                        user: req.body.user,
                        book: req.body.book
                    });
                    newLoan.save();
                    book.stock--;
                    book.save();
                    return res.status(201).send('Loan added!')
                })
            })  
        }
    }
    
})


router.put('/loans/:id', (req, res) => {
    if (utils.checkAPIKey(req.query.key,res)) {
        if (!req.query.loanStart &&
            !req.query.loanEnd ) {
            return res.status(400).send({ error: 'No params given. Valid params: loanStart, loanEnd' })
        }
        else{
            if(req.query.loanEnd && !req.query.loanStart){
                loanSchema.findOneAndUpdate({_id: req.params.id}, {loanEnd: req.query.loanEnd}, function(error, loan){
                    if(loan == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                    if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                    if(loan != null) return res.status(200).send('Loan updated!')
                }) 
            }
            if(req.query.loanStart && !req.query.loanEnd){
                loanSchema.findOneAndUpdate({_id: req.params.id}, {loanStart: req.query.loanStart}, function(error, loan){
                    if(loan == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                    if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                    if(loan != null) return res.status(200).send('Loan updated!')
                }) 
            }
            if(req.query.loanStart && req.query.loanEnd){
                loanSchema.findOneAndUpdate({_id: req.params.id}, {loanEnd: req.query.loanEnd, loanStart: req.query.loanStart}, function(error, loan){
                    if(loan == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                    if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                    if(loan != null) return res.status(200).send('Loan updated!')
                }) 
            }
        }
    }
})

router.delete('/loans/:id', (req, res) => {
    if (utils.checkAPIKey(req.query.key,res)) {
        loanSchema.findOneAndDelete({_id: req.params.id}, function(err, response){
            if(response == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(err) res.status(500).send({error:'Looks like something went wrong :('})
            bookSchema.findOne({_id: response.book}, function(err, book){
                if(err) return res.status(500).send({error:'Looks like something went wrong :('})
                book.stock++;
                book.save();
            })
            if(response != null) return res.status(204).send()
        });
    }
})

module.exports = router;