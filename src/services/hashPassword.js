require("dotenv").config();
const { pbkdf2 } = require("crypto");

const hashPassword = (password) => {
  if (password) {
    return new Promise((res, rej) => {
      pbkdf2(
        password,
        process.env.PASSWORD_SALT,
        10000,
        64,
        "sha512",
        (error, derivedKey) => {
          if (error) {
            rej(error);
          }
          res(derivedKey.toString("hex"));
        }
      );
    });
  }
};

module.exports = hashPassword;
