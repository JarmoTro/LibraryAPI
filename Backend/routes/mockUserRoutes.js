const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');

const users = []

for (let i = 0; i < 20; i++) {
    users.push(
        {
            id: i+1,
            username: faker.name.fullName(),
        }
    )
}

router.get('/users', (req, res) => {
    res.send(users)
})

router.post('/users', (req, res) => {
    const length = users.push(req.body)
    users[length-1] = {id: users[length-2].id+1,...users[length-1]}
    res.status(201).json(users[length-1])
})


router.get('/users/:id', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    let result = users.find(x=> x.id === parseInt(req.params.id))

    if (typeof(result) ==="undefined") {
        res.status(404).send({error:"User was not found"})
        return
    }
    res.send(result)
})

router.put('/users', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    const index = users.findIndex(x=> x.id === parseInt(req.params.id))

    if (index === -1) {
        res.status(404).send({error:"Users was not found"})
        return
    }

    users[index]= {...users[index],...req.body}
    res.status(200).json(users[index])
})

router.delete('/users/:id', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    const index = users.findIndex(x=> x.id === parseInt(req.params.id))

    if (index === -1) {
        res.status(404).send({error:"User was not found"})
        return
    }
    users.splice(index,1)
    res.status(204).send()
})

module.exports = router;