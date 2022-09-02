const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');

const bookSchema = new mongoose.Schema({

    id:{
        type: String,
        required: true,
        default: uuidv1()
    },
    title:{
        type: String,
        required: true,
        default: "Unknown title"
    },
    length:{
        type:Number,
        required: true,
    },
    author:{
        type:String,
        required: true,
        default: "Unknown author"
    },
    stock:{
        type:Number,
        required: true
    },
    ISBN:{
        type:String,
        required: true
    }

});

module.exports = mongoose.model('book',bookSchema);