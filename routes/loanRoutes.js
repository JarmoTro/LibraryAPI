const express = require('express');
const router = express.Router();
const loanSchema = require('../models/loan');
const bookSchema = require('../models/book');
const userSchema = require('../models/user');

router.get('/loans', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        loanSchema.find((error, loans) => {

            if (error) res.status(500).send('Looks like something went wrong :(')
    
            if (!error) res.send(loans);
    
        })
    }
})

router.get('/loans/user/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        loanSchema.find({user: req.params.id}, function(error, loans){
            if(loans == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(loans != null) return res.send(loans)
        })
    }
})

router.get('/loans/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        loanSchema.findOne({_id: req.params.id}, function(error, loan){
            if(loan == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(loan != null) return res.send(loan)
        }) 
    }
})


router.post('/loans', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if (!req.query.loanStart ||
            !req.query.loanEnd ||
            !req.query.user ||
            !req.query.book ) {
            return res.status(400).send({ error: 'One or all params are missing. Required params: loanStart, loanEnd, user, book' })
        }
        else{
            userSchema.findOne({_id: req.query.userId}, function (error, user){
                if(user == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                bookSchema.findOne({_id: req.query.bookId}, function(error, book){
                    if(book == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                    if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                    let newLoan = new loanSchema({
                        loanStart: req.query.loanStart,
                        loanEnd: req.query.loanEnd,
                        user: req.query.user,
                        book: req.query.book
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


router.put('/loans', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if(req.query.user){
            userSchema.findOne({_id: req.query.user}, function(error, user){
                if(user == null) return res.status(404).send({error:"The provided user id does not match an existing users id."})
            })
        }
        if(req.query.book){
            bookSchema.findOne({_id: req.query.book}, function(error, book){
                if(book == null) return res.status(404).send({error:"The provided book id does not match an existing books id."})
            })
        }
        loanSchema.findOneAndUpdate({_id: req.query.id}, req.query, function(error, loan){
            if(loan == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(loan != null) return res.status(200).send('Loan updated!')
        }) 
    }
})

router.delete('/loans/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        loanSchema.findOneAndDelete({_id: req.params.id}, function(err, response){
            if(response == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(err) res.status(500).send({error:'Looks like something went wrong :('})
            bookSchema.findOne({_id: response.id}, function(err, book){
                if(err) return res.status(500).send({error:'Looks like something went wrong :('})
                book.stock++;
                book.save();
            })
            if(response != null) return res.status(204).send()
        });
    }
})

module.exports = router;