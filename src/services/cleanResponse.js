const cleanResponse = (user) => {
  return {
    _id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarURL: user.avatarURL,
    rating: user.rating,
  };
};

module.exports = cleanResponse;
