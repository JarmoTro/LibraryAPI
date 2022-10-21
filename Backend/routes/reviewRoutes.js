const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/reviews/:id", reviewController.getReviewById);

router.put("/reviews/:id", reviewController.updateReview);

router.delete("/reviews/:id", reviewController.deleteReview);

router.get("/reviews/author/:id", reviewController.getReviewsByUser);

router.get("/reviews/book/:id", reviewController.getReviewsByBook);

router.post("/reviews/", reviewController.createReview);

module.exports = router;
