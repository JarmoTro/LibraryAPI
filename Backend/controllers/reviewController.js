const bookSchema = require("../models/book");
const userSchema = require("../models/user");
const reviewSchema = require("../models/review");
const utils = require("../utils/utils");
const { default: mongoose } = require("mongoose");
const { checkAPIKey } = require("../utils/utils");
const multer = require("multer");

const upload = multer();

exports.createReview = (req, res) => {
  let getBody = upload.any();
  getBody(req, res, function () {
    if (checkAPIKey(req.body.key, res)) {
      if (
        !req.body.title ||
        !req.body.body ||
        !req.body.rating ||
        !req.body.book ||
        !req.body.author
      ) {
        return res.status(400).send({
          error:
            "One or all params are missing. Required params: title, body, book, author, rating",
        });
      } else {
        bookSchema.findOne({ _id: req.body.book }, function (err, book) {
          if (book == null)
            return res.status(404).send({
              error:
                "Looks like we couldn't find the book you were looking for.",
            });
          userSchema.findOne({ _id: req.body.author }, function (err, user) {
            if (user == null)
              return res.status(404).send({
                error:
                  "Looks like we couldn't find the user you were looking for.",
              });
            let newReview = new reviewSchema({
              title: req.body.title,
              body: req.body.body,
              rating: req.body.rating,
              book: req.body.book,
              author: req.body.author,
            });
            newReview.save();
            return res.status(201).send("Review added!");
          });
        });
      }
    }
  });
};

exports.getReviewsByBook = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    if (req.params.id.length != 24) {
      return res.status(400).send({ error: "Invalid id format" });
    } else {
      reviewSchema
        .aggregate([
          { $match: { book: mongoose.Types.ObjectId(req.params.id) } },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $lookup: {
              from: "books",
              localField: "book",
              foreignField: "_id",
              as: "book",
            },
          },
          {
            $unwind: "$book",
          },
        ])
        .exec(function (error, reviews) {
          if (reviews == null || reviews.length == 0)
            return res.status(404).send({
              error: "Looks like we couldn't find what you were looking for.",
            });
          if (error)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          if (reviews != null) return res.send(utils.convertReview(reviews));
        });
    }
  }
};

exports.getReviewById = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    if (req.params.id.length != 24) {
      return res.status(400).send({ error: "Invalid id format" });
    } else {
      reviewSchema
        .aggregate([
          { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $lookup: {
              from: "books",
              localField: "book",
              foreignField: "_id",
              as: "book",
            },
          },
          {
            $unwind: "$book",
          },
        ])
        .exec(function (error, reviews) {
          if (reviews == null || reviews.length == 0)
            return res.status(404).send({
              error: "Looks like we couldn't find what you were looking for.",
            });
          if (error)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          if (reviews != null) return res.send(utils.convertReview(reviews));
        });
    }
  }
};

exports.getReviewsByUser = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    reviewSchema
      .aggregate([
        { $match: { author: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "book",
          },
        },
        {
          $unwind: "$book",
        },
      ])
      .exec(function (error, reviews) {
        if (reviews == null || reviews.length == 0)
          return res.status(404).send({
            error: "Looks like we couldn't find what you were looking for.",
          });
        if (error)
          return res
            .status(500)
            .send({ error: "Looks like something went wrong :(" });
        if (reviews != null) return res.send(utils.convertReview(reviews));
      });
  }
};

exports.updateReview = (req, res) => {
  let getBody = upload.any();
  getBody(req, res, function () {
    if (utils.checkAPIKey(req.body.key, res)) {
      reviewSchema.findOneAndUpdate(
        { _id: req.body.id },
        req.body,
        function (error, reviews) {
          if (reviews == null)
            return res.status(404).send({
              error: "Looks like we couldn't find what you were looking for.",
            });
          if (error)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          if (reviews != null) return res.status(200).send("Review updated!");
        }
      );
    }
  });
};

exports.deleteReview = (req, res) => {
  let getBody = upload.any();
  getBody(req, res, function () {
    if (utils.checkAPIKey(req.query.key, res)) {
      reviewSchema.findOneAndDelete(
        { _id: req.params.id },
        function (err, response) {
          if (response == null)
            return res.status(404).send({
              error: "Looks like we couldn't find what you were looking for.",
            });
          if (err)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          if (response != null) {
            return res.status(204).send();
          }
        }
      );
    }
  });
};
