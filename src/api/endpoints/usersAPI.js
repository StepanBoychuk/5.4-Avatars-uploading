const { Router } = require("express");
const logger = require("./../../logger.js");
const getUsersList = require("./../../services/getUsersList.js");
const getUser = require("./../../services/getUser.js");
const signup = require("./../../services/signup.js");
const update = require("./../../services/update.js");
const deleteUser = require("./../../services/deleteUser.js");
const cleanResponse = require("../../services/cleanResponse.js");
const {
  createValidator,
  updateValidator,
} = require("./../../validation/userValidation.js");
const voteValidator = require("./../../validation/voteValidation.js");
const auth = require("../../middlwares/auth.js");
const signin = require("./../../services/signin.js");
const canChangeUserData = require("./../../middlwares/canChangeUserData.js");
const vote = require("./../../services/rating.js");
const lastVoteTime = require("./../../middlwares/lastVoteTime.js");
const ifUserExist = require("./../../middlwares/ifUserExist.js");
const checkFileSize = require('./../../middlwares/checkFileSize.js')
const {getPresignedURL} = require('./../../services/s3.js')

const usersAPI = Router();


usersAPI.get("/api/users", async (req, res) => {
  try {
    const page = req.query.page || 0;
    const perPage = req.query.perPage || 3;
    if (perPage > 100) {
      res
        .status(400)
        .send(
          "The data you are trying to request in a single request is to large"
        );
    }

    return res.send(await getUsersList(page, perPage));
  } catch (error) {
    logger.error(error);
    res.status(400).send(error.message);
  }
});

usersAPI.get("/api/users/:id", ifUserExist, async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    const { updatedAt } = user;
    res.setHeader("Last-Modified", updatedAt).send(cleanResponse(user));
  } catch (erorr) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

usersAPI.post("/api/users/signup", createValidator, async (req, res) => {
  try {
    await signup(req.body);
    res.status(201).send(req.body);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

usersAPI.post("/api/users/avatar", auth, checkFileSize,  async (req, res) => {
  try {
    const {avatarName} = req.body
    if (!avatarName) {
      return res.status(400).send("avatarName is required")
    }
    const presignedURL = await getPresignedURL(req.user.id, avatarName)
    res.send(presignedURL)
  }catch(error){
    logger.error(error)
    res.status(500).send(error.message)
  }
})

usersAPI.put(
  "/api/users/:id",
  auth,
  canChangeUserData,
  ifUserExist,

  updateValidator,
  async (req, res) => {
    try {
      const ifUnmodifiedSince = new Date(req.headers["if-unmodified-since"]);
      const { updatedAt } = await getUser(req.params.id);
      if (ifUnmodifiedSince && ifUnmodifiedSince > updatedAt) {
        return res.status(412).send("Precondition failed");
      }
      await update(req.params.id, req.body);
      res
        .setHeader("Last-Modified", new Date().toUTCString())
        .status(201)
        .send(req.body);
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

usersAPI.delete(
  "/api/users/:id",
  auth,
  canChangeUserData,
  ifUserExist,

  async (req, res) => {
    try {
      await deleteUser(req.params.id);
      res.send(new Date().toUTCString());
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

usersAPI.post("/api/users/signin", async (req, res) => {
  try {
    const token = await signin(req.body);
    if (!token) {
      res.status(401).send("Invalid credentials");
    }
    res.setHeader("Authorization", "Bearer " + token).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

usersAPI.post(
  "/api/users/:id/vote",
  auth,
  ifUserExist,
  voteValidator,
  lastVoteTime,
  async (req, res) => {
    try {
      await vote(req.user.id, req.params.id, req.body.voteType);
      res.send();
    } catch (error) {
      logger.error(error);
      res.status(500).send(error.message);
    }
  }
);

module.exports = usersAPI;
