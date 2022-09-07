const mongoose = require('mongoose');
const book = require('../models/book').schema;
const user = require('../models/user').schema;
const { v1: uuidv1 } = require('uuid');

const loanSchema = new mongoose.Schema({

    id:{
        type: String,
        required: true,
        default: uuidv1()
    },
    loanStart:{
        type:Number
    },
    loanEnd:{
        type:Number
    },
    book:{
        type:book
    },
    user:{
        type:user
    }


});

module.exports = mongoose.model('loan',loanSchema);