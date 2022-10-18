const partialUserDTO = require('../DTOs/partialUserDTO')
const utils = require('../../utils/convertTime');
const bookDTO = require('./bookDTO');

module.exports = function reviewDTO(review){
    const reviewDTO = {
        _id: review._id,
        title: review.title,
        author: review.author,
        body: review.body,
        book: bookDTO(review.book),
        rating: review.rating,
        createdAt: utils.convertTime(review.createdAt),
        user: partialUserDTO(review.user)
      }
      return reviewDTO;
  }