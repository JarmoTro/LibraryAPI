const utils = require('../../utils/convertTime');
const bookDTO = require('./bookDTO');
const userDTO = require('./userDTO');


module.exports = function loanDTO(loan){
    const loanDTO = {
        _id: loan._id,
        loanStart: utils.convertTime(loan.loanStart),
        loanEnd: utils.convertTime(loan.loanEnd),
        book: loan.book,
        user: loan.user,
        aggregatedBook: bookDTO(loan.aggregatedBook),
        aggregatedUser: userDTO(loan.aggregatedUser)
      }
      return loanDTO;
  }