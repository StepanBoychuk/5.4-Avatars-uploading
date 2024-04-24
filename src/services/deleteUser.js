const User = require("./../models/User.js");

const deleteUser = async (userID) => {
  const user = await User.findByIdAndUpdate(userID, {
    deletedAt: new Date().toUTCString(),
  });
};

module.exports = deleteUser;
