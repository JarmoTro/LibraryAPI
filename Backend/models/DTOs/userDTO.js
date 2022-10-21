module.exports = function userDTO(user) {
  const userDTO = {
    _id: user._id,
    username: user.username,
    admin: user.admin,
  };
  return userDTO;
};
