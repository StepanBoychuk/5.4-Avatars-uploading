const { Schema, model } = require("mongoose");

const VoteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  voteType: {
    type: Number,
    enum: [1, 0, -1],
    required: true,
  },
},
{ timestamps: true});

const Vote = model("Votes", VoteSchema, "votes");

module.exports = Vote;
