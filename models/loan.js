const mongoose = require('mongoose');
const book = require('../models/book');
const { v1: uuidv1 } = require('uuid');

const loanSchema = new mongoose.Schema({

    id:{
        type: String,
        required: true,
        default: uuidv1()
    },
    loanStart:{
        type:Date,
        required:true
    },
    loanEnd:{
        type:Date,
        required: true
    },
    book:{
        type: book,
        required: true
    }

});

module.exports = mongoose.model('loan',loanSchema);