const mongoose = require('mongoose');
const book = require('../models/book');
const user = require('../models/user');
const { v1: uuidv1 } = require('uuid');

const loanSchema = new mongoose.Schema({

    id:{
        type: String,
        required: true,
        default: uuidv1()
    },
    loanStart:{
        type:Date
    },
    loanEnd:{
        type:Date
    },
    book:{
        type: book
    },
    user:{
        type: user
    }


});

module.exports = mongoose.model('loan',loanSchema);