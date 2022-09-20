module.exports = function partialUserDTO(user){
    const partialUserDTO = {
        _id: user._id,
        username: user.username,
      }
      return partialUserDTO;
  }