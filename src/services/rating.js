const User = require("./../models/User.js");
const Vote = require("./../models/Vote.js");

const vote = async (userID, targetID, voteType) => {
  const vote = await Vote.findOne({ user: userID, targetUser: targetID });
  if (!vote) {
    const newVote = new Vote({
      user: userID,
      targetUser: targetID,
      voteType: voteType,
    });
    return await newVote.save();
  }
  if (vote.voteType == voteType) {
    vote.voteType = 0
    return await vote.save();
  }
  vote.voteType = voteType;
  return await vote.save();
};

module.exports = vote;
