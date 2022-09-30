const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');
const userSchema = require('../models/user');
const reviewSchema = require('../models/review');
const utils = require('../utils/utils');
const reviewDTO = require('../models/DTOs/reviewDTO');
const { default: mongoose } = require('mongoose');

/*router.get('/reviews', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.find({}, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.send(utils.convertReview(reviews))
        })
    }
})*/


router.post('/reviews', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if(!req.query.title ||
            !req.query.body ||
            !req.query.rating ||
            !req.query.book ||
            !req.query.author){
                return res.status(400).send({ error: 'One or all params are missing. Required params: title, body, bookId, authorId, rating' })
            }
            else{
                bookSchema.findOne({_id: req.query.book}, function(err, book){
                    if(book == null) return res.status(404).send({error:"Looks like we couldn't find the book you were looking for."})
                    userSchema.findOne({_id: req.query.author}, function(err, user) {
                        if(user == null) return res.status(404).send({error:"Looks like we couldn't find the user you were looking for."})
                        let newReview = new reviewSchema({
                            title: req.query.title,
                            body: req.query.body,
                            rating: req.query.rating,
                            book: req.query.book,
                            author: req.query.author
                        })
                        newReview.save()
                        return res.status(201).send('Review added!')
                    })
                })
            }
    }
})

router.get('/reviews/book/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if (req.params.id.length != 24) {
            return res.status(400).send({error:'Invalid id format'})
        }
        else {
            reviewSchema.aggregate([
                {$match: {book: mongoose.Types.ObjectId(req.params.id)}},
                {$lookup: {from: "users", localField: "author", foreignField:"_id", as:"user"}}
            ]).exec(function(error, reviews){
                if(reviews == null || reviews.length == 0) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                if(reviews != null) return res.send(utils.convertReview(reviews))
            })
        }
    }
})

router.get('/reviews/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if (req.params.id.length != 24) {
            return res.status(400).send({error:'Invalid id format'})
        }
        else {
            reviewSchema.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
                {$lookup: {from: "users", localField: "author", foreignField:"_id", as:"user"}}
            ]).exec(function(error, reviews){
                if(reviews == null || reviews.length == 0) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                if(reviews != null) return res.send(utils.convertReview(reviews))
            })
        }
    }
})

router.get('/reviews/author/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.find({author: req.params.id}, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find the user you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.send(utils.convertReview(reviews))
        })
    }
})

router.put('/reviews/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
            reviewSchema.findOneAndUpdate({_id: req.params.id}, req.query, function(error, reviews){
                    if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
                    if(error) return res.status(500).send({error:'Looks like something went wrong :('})
                    if(reviews != null) return res.status(200).send('Review updated!')
                
            }) 
        
    }
})

router.delete('/reviews/:id', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        reviewSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
            if (response == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
            if (err) return res.status(500).send({ error: 'Looks like something went wrong :(' })
            if (response != null) {
                return res.status(204).send()
            }
        });
    }
})

module.exports = router;