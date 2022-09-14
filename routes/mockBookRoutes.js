const { parse } = require('dotenv');
const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');

const books = [
    {id: 1, title: "All Quiet on the Western Front", length: 200, author: "Erich Maria Remarque", stock: 2, ISBN: "4356346457", category: "Historical Fiction"},
    {id: 2, title: "Blood Meridian", length: 337, author: "Cormac McCarthy", stock: 2, ISBN: "23124325", category: "Western"},
    {id: 3, title: "The Lord of the Rings", length: 479, author: "Cormac McCarthy", stock: 6, ISBN: "241254325", category: "Fantasy"}

]

router.get('/books', (req, res) => {
    res.send(books)
})

router.post('/books', (req, res) => {
    const length = books.push(req.body)
    books[length-1] = {id: books[length-2].id+1,...books[length-1]}
    res.status(201).json(books[length-1])
})


router.get('/books/:id', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    let result = books.find(x=> x.id === parseInt(req.params.id))

    if (typeof(result) ==="undefined") {
        res.status(404).send({error:"Book was not found"})
        return
    }
    res.send(result)
})

router.put('/books', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    const index = books.findIndex(x=> x.id === parseInt(req.params.id))

    if (index === -1) {
        res.status(404).send({error:"Book was not found"})
        return
    }

    books[index]= {...books[index],...req.body}
    res.status(200).json(books[index])
})

router.delete('/books/:id', (req, res) => {
    if (!(parseInt(req.params.id) > 0)) {
        res.status(400).send({error: "ID must be positive integer"})
        return
    }
    const index = books.findIndex(x=> x.id === parseInt(req.params.id))

    if (index === -1) {
        res.status(404).send({error:"Book was not found"})
        return
    }
    books.splice(index,1)
    res.status(204).send()
})

module.exports = router;