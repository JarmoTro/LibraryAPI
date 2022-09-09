const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({

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