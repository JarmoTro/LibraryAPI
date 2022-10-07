const express = require('express');
const router = express.Router();
const userSchema = require('../models/user');
const utlis = require('../utils/utils')
const userDTO = require('../models/DTOs/userDTO');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

router.post('/register', async (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        const { username, password } = req.query;
        if (!username || !password) {
          return res.status(400).send({error:'Missing parameters'});
        }
        else {
        const newUser = userSchema({
            username,
            password,
        });
        try {
          await newUser.save();
        } catch {
          return res.status(400).send({error: 'Username is already in use'});
        }
        let token;
        try {
          token = jwt.sign(
            { userId: newUser.id, username: newUser.username, admin: newUser.admin },
            process.env.SECRET,
            { expiresIn: "1h" }
          );
        } catch (err) {
            return res.status(500).send({ error: 'Looks like something went wrong :(' })
        }
        return res.status(201).send("User created!")

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
          return res.status(500).send({ error:'Something went wrong'});
        }
        if (!existingUser) {
          return res.status(404).send({ error:'User not found'});
        }
        const auth = await bcrypt.compare(password, existingUser.password);
      
        if (!auth) {
          return res.status(401).send({ error:'Invalid credentials'});
        }
        let token;
        try {
          token = jwt.sign(
            { userId: existingUser.id, username: existingUser.username, admin: existingUser.admin },
            process.env.SECRET,
            { expiresIn: "1h" }
          );
          console.log(token);
        } catch (err) {
            return res.status(500).send({ error: 'Looks like something went wrong :(' })
        }

        return res.status(200).json({token:token});

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
            if (!req.headers.authorization) {
                return res.status(400).send({error:'Token was not provided'});
            }
            const token = req.headers.authorization.split(' ')[1]; 
                try {
                    const decodedToken = jwt.verify(token,process.env.SECRET );
                    const user = userSchema({
                        _id: decodedToken.userId,
                        username: decodedToken.username,
                        admin: decodedToken.admin
                    });
                    
                   return res.status(200).send(userDTO(user))
                } catch (error) {
                    return res.status(400).send({error:'Failed to verify token'});
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