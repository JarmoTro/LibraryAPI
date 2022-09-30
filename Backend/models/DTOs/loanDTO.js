const utils = require('../../utils/convertTime');

module.exports = function loanDTO(loan){
    const loanDTO = {
        _id: loan._id,
        loanStart: utils.convertTime(loan.loanStart),
        loanEnd: utils.convertTime(loan.loanEnd),
        book: loan.book,
        user: loan.user,
      }
      return loanDTO;
  }