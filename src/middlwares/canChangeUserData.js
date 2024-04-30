const canChangeUserData = (req, res, next) => {
  try {
    if (req.user.id == req.params.id || req.user.role == "admin") {
      return next();
    }
    res.status(403).send("Forbiden");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports = canChangeUserData;
