module.exports = function reviewDTO(review){
    const reviewDTO = {
        _id: review._id,
        title: review.title,
        author: review.author,
        body: review.body,
        book: review.book,
        rating: review.rating,
        createdAt: review.createdAt,
      }
      return reviewDTO;
  }