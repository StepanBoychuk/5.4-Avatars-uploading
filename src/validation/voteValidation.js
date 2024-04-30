const Joi = require("joi");

const voteSchema = Joi.object({
  voteType: Joi.number().valid(1, -1).required(),
});

const voteValidator = (req, res, next) => {
  const { error } = voteSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  next();
};

module.exports = voteValidator;
