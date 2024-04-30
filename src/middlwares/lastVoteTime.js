const Vote = require("./../models/Vote.js");

const lastVoteTime = async (req, res, next) => {
  const oneHourAgo = new Date(Date.now() - 3600000);
  const vote = await Vote.findOne({
    user: req.user.id,
    updatedAt: { $gt: oneHourAgo },
  });
  if (vote) {
    return res.status(429).send("You can vote once an hour");
  }
  next();
};

module.exports = lastVoteTime;
