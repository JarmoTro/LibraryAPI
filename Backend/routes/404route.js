const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');


router.get('*', (req, res) => {
    let key
    if (req.query.key) {
        key = req.query.key
    }
    if (req.body.key){
        key = req.body.key
    }
    if (utils.checkAPIKey(key,res)) {
    return res.status(404).send({ error: 'Invalid route. Please check documentation' });
    }
})

module.exports = router;