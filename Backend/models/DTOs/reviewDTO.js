const partialUserDTO = require('../DTOs/partialUserDTO')

module.exports = function reviewDTO(review){
    const reviewDTO = {
        _id: review._id,
        title: review.title,
        author: review.author,
        body: review.body,
        book: review.book,
        rating: review.rating,
        createdAt: review.createdAt,
        user: partialUserDTO(review.user[0])
      }
      return reviewDTO;
  }