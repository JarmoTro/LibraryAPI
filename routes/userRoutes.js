const express = require('express');
const router = express.Router();
const userSchema = require('../models/user');
const passport = require('passport')


router.post('/users', (req, res) => {
    if (!req.query.username ||
        !req.query.password) {
        return res.status(400).send({ error: 'One or all params are missing. Required params: username, password, admin, loans.' })
    }
    else{
        userSchema.register({username: req.query.username}, req.query.password, (error, user) => {
            if (error) {
                console.log(req.body.username);
                res.status(500).send('Looks like something went wrong :(');
            } else {
                passport.authenticate('local')(req, res, ()=> {
                    return res.status(201).send('User created!')
                });
            }
        });
    }
});

module.exports = router;