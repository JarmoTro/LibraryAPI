const express = require('express');
const router = express.Router();
const userSchema = require('../models/user');
const utlis = require('../utils/utils')
const userDTO = require('../models/DTOs/userDTO');
const { convertUser } = require('../utils/utils');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post('/users', async (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        const { username, password } = req.query;
        if (!username || !password) {
          return res.status(400).send('Missing parameters');
        }
        else {
        const newUser = userSchema({
            username,
            password,
        });
        try {
          await newUser.save();
        } catch {
          return res.status(400).send('Username is already in use');
        }
        let token;
        try {
          token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            process.env.SECRET,
            { expiresIn: "1h" }
          );
        } catch (err) {
            return res.status(500).send({ error: 'Looks like something went wrong :(' })
        }
        res
          .status(201)
          .json({
            success: true,
            data: { userId: newUser.id,
                username: newUser.username, token: token },
          });
    }
    } 
});

router.post('/login' , async (req, res)  => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else {
        let { username, password } = req.query;
 
        let existingUser;
      
        try {
          existingUser = await userSchema.findOne({ username: username });
        } catch {
          return res.status(500).send('Something went wrong');
        }
        if (!existingUser) {
          return res.status(404).send('User not found');
        }
        const auth = await bcrypt.compare(password, existingUser.password);
      
        if (!auth) {
          return res.status(401).send('Invalid credentials');
        }
        let token;
        try {
          //Creating jwt token
          token = jwt.sign(
            { userId: existingUser.id, username: existingUser.username },
            process.env.SECRET,
            { expiresIn: "1h" }
          );
        } catch (err) {
            return res.status(500).send({ error: 'Looks like something went wrong :(' })
        }
       
        res
          .status(200)
          .json({
            success: true,
            data: {
              userId: existingUser.id,
              username: existingUser.username,
              token: token,
            },
          });
}
});

router.put('/users/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else {
        userSchema.findOne({username: req.query.username}, function(err, user){
            if(user!=null){
                return res.status(409).send({ error: 'Username is already taken.' })
            } 
            else{
                userSchema.findOneAndUpdate({_id: req.params.id}, req.query, function(err, user){
                    if(!req.params.id) return res.status(400).send({ error: 'Missing id parameter.' })
                    if (user == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
                    if (err) return res.status(500).send({ error: 'Looks like something went wrong :(' })
                    if (req.query.oldPassword || req.query.newPassword){
                        if(!req.query.oldPassword || !req.query.newPassword) return res.status(400).send({ error: 'Both oldPassword and newPassword parameters must be provided.' })
                        else{
                            user.changePassword(req.query.oldPassword, req.query.newPassword, function (err) {
                                if (err) {
                                    return res.status(403).send({error: 'Invalid password.'});
                                }
                                if(!err){
                                    return res.status(200).send('User updated!')
                                }
                            })
                        }
                    } 
                    else{
                        if (user != null) return res.status(200).send('User updated!')
                    }
                    
                })
            }
        })
        
    }
})

router.post('/logout', function(req, res, next){
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else {
        req.logout(function(err) {
            if (err) {return res.status(500).send({error:'Looks like something went wrong :('})}
            return res.status(200).send('Logged out');
          });
    }
  });

router.get('/users', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        userSchema.find((error, users) => {

            if (error) return res.status(500).send({error:'Looks like something went wrong :('})
    
            if (!error) return res.send(utlis.convertUser(users));
    
        })
    }
})

router.get('/users/currentuser', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else {
        if (req.isAuthenticated()) {
                return res.status(200).send(userDTO(req.user))
        }
        else {
            return res.status(401).send({error: 'User is not logged in.'})
        }
    }
})


router.get('/users/:id', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        userSchema.findOne({ _id: req.params.id }, function (error, user) {
            if (user == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
            if (error) return res.status(500).send({ error: 'Looks like something went wrong :(' })
            if (user != null) return res.send(userDTO(user));
        })
    }
})
module.exports = router;