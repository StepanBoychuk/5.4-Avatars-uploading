const cron = require("node-cron");
const User = require("./../models/User.js");
const Vote = require("./../models/Vote.js");

cron.schedule("*/5 * * * *", async () => {
  const users = await User.find({}, "rating");
  users.forEach(async (user) => {
    const upvotes = await Vote.countDocuments({
      targetUser: user.id,
      voteType: 1,
    });
    const downvotes = await Vote.countDocuments({
      targetUser: user.id,
      voteType: -1,
    });
    const ratingSum = upvotes - downvotes;
    if (ratingSum != user.rating) {
      user.rating = ratingSum;
      await user.save();
    }
  });
});
