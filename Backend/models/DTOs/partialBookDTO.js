module.exports = function partialBookDTO(book) {
  const partialBookDTO = {
    _id: book._id,
    title: book.title,
    author: book.author,
    imgSource: book.imgSource,
    stock: book.stock,
  };
  return partialBookDTO;
};
