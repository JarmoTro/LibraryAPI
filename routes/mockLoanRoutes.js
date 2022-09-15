const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');

const loans = []

for (let i = 0; i < 20; i++) {
    loans.push(
        {
            id: i+1,
            loanStart: faker.date.between(),
            loanEnd: faker.date.future(),
            book: {
                id: i+1,
                title: faker.word.verb(),
                author: faker.name.fullName(),
                length: faker.random.numeric(3),
                stock: faker.random.numeric(),
                ISBN: faker.random.numeric(7),
                category: faker.music.genre()
            },
            user: {
                id: i+1,
                username: faker.name.fullName()
            }
        }
    )
}

router.get('/loans', (req, res) => {
    res.send(loans)
})

router.post('/loans', (req, res) => {
    const length = loans.push(req.body)
    loans[length-1] = {id: loans[length-2].id+1,...loans[length-1]}
    res.status(201).json(loans[length-1])
})


router.get('/loans/:id', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    let result = loans.find(x=> x.id === parseInt(req.params.id))

    if (typeof(result) ==="undefined") {
        res.status(404).send({error:"Loan was not found"})
        return
    }
    res.send(result)
})

router.put('/loans', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    const index = loans.findIndex(x=> x.id === parseInt(req.params.id))

    if (index === -1) {
        res.status(404).send({error:"Loans was not found"})
        return
    }

    loans[index]= {...loans[index],...req.body}
    res.status(200).json(loans[index])
})

router.delete('/loans/:id', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    const index = loans.findIndex(x=> x.id === parseInt(req.params.id))

    if (index === -1) {
        res.status(404).send({error:"Loans was not found"})
        return
    }
    loans.splice(index,1)
    res.status(204).send()
})

module.exports = router;