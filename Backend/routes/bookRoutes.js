const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/books/", bookController.getBooks);

router.get("/books/:id", bookController.getBookById);

router.get("/books/search/:keyword", bookController.getBookByKeyword);

router.get("/books/author/:author", bookController.getBooksByAuthor)

router.delete("/books/:id", bookController.deleteBook);

router.post("/books", bookController.createBook);

router.put("/books/", bookController.updateBook);

module.exports = router;
