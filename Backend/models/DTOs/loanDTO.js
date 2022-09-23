module.exports = function loanDTO(loan){
    const loanDTO = {
        _id: loan._id,
        loanStart: loan.loanStart,
        loanEnd: loan.loanEnd,
        book: loan.book,
        user: loan.user,
      }
      return loanDTO;
  }