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
    },
    imgSource:{
        type:String
    },
    localImgPath:{
        type:String
    }

});

module.exports = mongoose.model('book',bookSchema);