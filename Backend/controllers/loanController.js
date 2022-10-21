const loanSchema = require("../models/loan");
const bookSchema = require("../models/book");
const userSchema = require("../models/user");
const utils = require("../utils/utils");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const upload = multer();

exports.getLoans = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    loanSchema
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "aggregatedBook",
          },
        },
        {
          $unwind: "$aggregatedBook",
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "aggregatedUser",
          },
        },
        {
          $unwind: "$aggregatedUser",
        },
      ])
      .sort({ loanEnd: 1 })
      .exec(function (error, loans) {
        if (error) res.status(500).send("Looks like something went wrong :(");

        if (!error) res.send(utils.convertLoan(loans));
      });
  }
};

exports.getUserLoans = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    loanSchema
      .aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "aggregatedBook",
          },
        },
        {
          $unwind: "$aggregatedBook",
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "aggregatedUser",
          },
        },
        {
          $unwind: "$aggregatedUser",
        },
      ])
      .exec(function (error, loans) {
        if (loans == null)
          return res.status(404).send({
            error: "Looks like we couldn't find what you were looking for.",
          });
        if (error)
          return res
            .status(500)
            .send({ error: "Looks like something went wrong :(" });
        if (loans != null) return res.send(utils.convertLoan(loans));
      });
  }
};

exports.getLoanById = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    loanSchema
      .aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "aggregatedBook",
          },
        },
        {
          $unwind: "$aggregatedBook",
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "aggregatedUser",
          },
        },
        {
          $unwind: "$aggregatedUser",
        },
      ])
      .exec(function (error, loan) {
        if (loan == null)
          return res.status(404).send({
            error: "Looks like we couldn't find what you were looking for.",
          });
        if (error)
          return res
            .status(500)
            .send({ error: "Looks like something went wrong :(" });
        if (loan != null) return res.send(utils.convertLoan(loan));
      });
  }
};

exports.createLoan = (req, res) => {
  const getBody = upload.any();
  getBody(req, res, function () {
    if (utils.checkAPIKey(req.body.key, res)) {
      if (
        !req.body.loanStart ||
        !req.body.loanEnd ||
        !req.body.user ||
        !req.body.book
      ) {
        return res.status(400).send({
          error:
            "One or all params are missing. Required params: loanStart, loanEnd, user, book",
        });
      } else {
        userSchema.findOne({ username: req.body.user }, function (error, user) {
          if (user == null)
            return res.status(404).send({
              error:
                "Looks like we couldn't find the user you were looking for.",
            });
          if (error)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          bookSchema.findOne({ _id: req.body.book }, function (error, book) {
            if (book == null)
              return res.status(404).send({
                error:
                  "Looks like we couldn't find the book you were looking for.",
              });
            if (error)
              return res
                .status(500)
                .send({ error: "Looks like something went wrong :(" });
            let newLoan = new loanSchema({
              loanStart: req.body.loanStart,
              loanEnd: req.body.loanEnd,
              user: user._id,
              book: req.body.book,
            });
            newLoan.save();
            book.stock--;
            book.save();
            return res.status(201).send("Loan added!");
          });
        });
      }
    }
  });
};

exports.updateLoan = (req, res) => {
  const getBody = upload.any();
  getBody(req, res, function () {
    if (utils.checkAPIKey(req.body.key, res)) {
      if (!req.body.loanStart && !req.body.loanEnd) {
        return res
          .status(400)
          .send({ error: "No params given. Valid params: loanStart, loanEnd" });
      } else {
        try {
          mongoose.Types.ObjectId(req.body.id);
        } catch {
          return res
            .status(400)
            .send({ error: "Id must be parseable to a Mongo objectId." });
        }
        loanSchema.findOneAndUpdate(
          { _id: req.body.id },
          req.body,
          function (error, loan) {
            if (loan == null)
              return res.status(404).send({
                error: "Looks like we couldn't find what you were looking for.",
              });
            if (error)
              return res
                .status(500)
                .send({ error: "Looks like something went wrong :(" });
            if (loan != null) return res.status(200).send("Loan updated!");
          }
        );
      }
    }
  });
};

exports.deleteLoan = (req, res) => {
  if (utils.checkAPIKey(req.query.key, res)) {
    loanSchema.findOneAndDelete(
      { _id: req.query.id },
      function (err, response) {
        if (response == null)
          return res.status(404).send({
            error: "Looks like we couldn't find what you were looking for.",
          });
        if (err)
          res.status(500).send({ error: "Looks like something went wrong :(" });
        bookSchema.findOne({ _id: response.book }, function (err, book) {
          if (err)
            return res
              .status(500)
              .send({ error: "Looks like something went wrong :(" });
          book.stock++;
          book.save();
        });
        if (response != null) return res.status(204).send();
      }
    );
  }
};
