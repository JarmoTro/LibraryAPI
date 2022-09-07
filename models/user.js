const mongoose = require('mongoose');
const loan = require('../models/loan').schema;
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({

    id:{
        type: String,
        required: true,
        default: uuidv1()
    },
    username:{
        type: String
    },
    password:{
        type: String
    },
    admin:{
        type: Boolean,
        default: false
    },
    loans:{
        type: [loan]
    }
});

module.exports = mongoose.model('user',userSchema);