const mongoose = require('mongoose');
const book = require('../models/book').schema;
const user = require('../models/user').schema;

const loanSchema = new mongoose.Schema({
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