const mongoose = require('mongoose');
const book = require('../models/book').schema;
const user = require('../models/user').schema;

const reviewSchema = new mongoose.Schema({
    title:{
        type:String
    },
    body:{
        type:String
    },
    rating:{
        type:Number
    },
    book:{
        type:book
    },
    author:{
        type:user
    },
    createdAt:{
        type:Number,
        default: Date.now()
    }
});

module.exports = mongoose.model('review',reviewSchema);