const utils = require('../../utils/convertTime');

module.exports = function bookDTO(book){
    const bookDTO = {
        _id: book._id,
        title: book.title,
        author: book.author,
        imgSource: book.imgSource,
        stock: book.stock,
        description: book.description,
        publicationDate: utils.convertTime(book.publicationDate),
        genre: book.genre,
        ISBN: book.ISBN,
        length: book.length,
      }
      return bookDTO;
  }