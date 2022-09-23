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
        type:String
    },
    user:{
        type:String
    }
});

module.exports = mongoose.model('loan',loanSchema);