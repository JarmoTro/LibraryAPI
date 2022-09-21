const express = require('express');
const router = express.Router();


router.get('*', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        return res.status(404).send({ error: 'Invalid route. Please check documentation' });
    }
})

module.exports = router;