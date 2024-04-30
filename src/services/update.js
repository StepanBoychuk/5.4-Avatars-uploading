const User = require("./../models/User.js");

const update = async (userID, data) => {
  await User.findByIdAndUpdate(
    userID ,
    {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      ["tech.updated_at"]: new Date().toUTCString(),
    }
  );
};

module.exports = update;
