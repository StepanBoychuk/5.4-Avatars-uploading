const { Schema, model } = require("mongoose");
const hashPassword = require("./../services/hashPassword.js");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    avatarURL: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    rating: {
      type: Number,
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (this.password) {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  let update = this.getUpdate();
  const password = await hashPassword(update.password);
  update.password = password;
  next();
});

userSchema.pre("find", async function (next) {
  this.where({ deletedAt: null });
  next();
});
userSchema.pre("findOne", async function (next) {
  this.where({ deletedAt: null });
});

const User = model("User", userSchema, "users");

module.exports = User;
