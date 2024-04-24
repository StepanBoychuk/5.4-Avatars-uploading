require("dotenv").config();
require("./src/services/updateUserRating.js")
require("./src/services/sqsCrone.js")
const logger = require("./src/logger");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const usersAPI = require("./src/api/endpoints/usersAPI.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use("/", usersAPI);

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
mongoose
  .connect(
    `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  )
  .catch((error) => logger.error(error))
  .then(() => console.log("MongoDB connected"));
