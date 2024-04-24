const User = require("./../models/User.js");

const signup = async (data) => {
  const user = new User({
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    password: data.password,
  });
  await user.save();
};

module.exports = signup;
