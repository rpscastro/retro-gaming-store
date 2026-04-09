const { body, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const validate = {};

/*  **********************************
 *  Favorite Data Validation Rules
 * ********************************* */
validate.addFavoriteRules = () => {
  return [
    // userId is required and must be a valid ObjectId
    body("userId")
      .notEmpty()
      .withMessage("userId is required.")
      .custom((value) => ObjectId.isValid(value))
      .withMessage("The userId given does not meet requirements."),

    // productId is required and must be a valid ObjectId
    body("productId")
      .notEmpty()
      .withMessage("productId is required.")
      .custom((value) => ObjectId.isValid(value))
      .withMessage("The productId given does not meet requirements."),
  ];
};

validate.checkFavoriteData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }
  next();
};

module.exports = validate;
