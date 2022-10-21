const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");

const books = [];

for (let i = 0; i < 20; i++) {
  books.push({
    id: i + 1,
    title: faker.word.verb(),
    author: faker.name.fullName(),
    length: faker.random.numeric(3),
    stock: faker.random.numeric(),
    ISBN: faker.random.numeric(7),
    genre: faker.music.genre(),
  });
}

router.get("/books", (req, res) => {
  res.send(books);
});

router.post("/books", (req, res) => {
  const length = books.push(req.body);
  books[length - 1] = { id: books[length - 2].id + 1, ...books[length - 1] };
  res.status(201).json(books[length - 1]);
});

router.get("/books/:id", (req, res) => {
  if (!(parseInt(req.params.id) > 0)) {
    res.status(400).send({ error: "ID must be positive integer" });
    return;
  }
  let result = books.find((x) => x.id === parseInt(req.params.id));

  if (typeof result === "undefined") {
    res.status(404).send({ error: "Book was not found" });
    return;
  }
  res.send(result);
});

router.put("/books", (req, res) => {
  if (!(parseInt(req.params.id) > 0)) {
    res.status(400).send({ error: "ID must be positive integer" });
    return;
  }
  const index = books.findIndex((x) => x.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send({ error: "Book was not found" });
    return;
  }

  books[index] = { ...books[index], ...req.body };
  res.status(200).json(books[index]);
});

router.delete("/books/:id", (req, res) => {
  if (!(parseInt(req.params.id) > 0)) {
    res.status(400).send({ error: "ID must be positive integer" });
    return;
  }
  const index = books.findIndex((x) => x.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send({ error: "Book was not found" });
    return;
  }
  books.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
