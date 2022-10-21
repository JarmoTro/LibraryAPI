const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  length: {
    type: Number,
  },
  author: {
    type: String,
  },
  stock: {
    type: Number,
  },
  ISBN: {
    type: String,
  },
  genre: {
    type: String,
  },
  imgSource: {
    type: String,
  },
  localImgPath: {
    type: String,
  },
  description: {
    type: String,
  },
  publicationDate: {
    type: Number,
  },
});

module.exports = mongoose.model("book", bookSchema);
