const checkFileSize = (req, res, next) => {
  const maxFileSize = 20 * 1024 * 1024; //20MB
  if (req.headers["content-lenght"] > maxFileSize) {
    return res.status(413).send("File size is too big.");
  }
  next();
};

module.exports = checkFileSize;
