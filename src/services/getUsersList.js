const User = require("../models/User.js");
const cleanResponse = require('./cleanResponse.js')

const getUsersList = async (page, perPage) => {
  let users = await User.find({}, "username firstName lastName avatarURL rating")
    .skip(page * perPage)
    .limit(perPage);
  return await users.map(cleanResponse)
};

module.exports = getUsersList;
