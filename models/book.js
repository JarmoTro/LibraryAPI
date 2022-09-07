const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');

const bookSchema = new mongoose.Schema({

    id:{
        type: String,
        default: uuidv1()
    },
    title:{
        type: String
    },
    length:{
        type:Number
    },
    author:{
        type:String
    },
    stock:{
        type:Number
    },
    ISBN:{
        type:String
    },
    category:{
        type:String
    }

});

module.exports = mongoose.model('book',bookSchema);