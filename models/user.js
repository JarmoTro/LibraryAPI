const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
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

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = mongoose.model('user',userSchema);