const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  User Data Validation Rules
 * ********************************* */
validate.addUserRules = () => {
  return [
    // email is required and must be a valid email address
    body("email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("The email given does not meet requirements."),

  // username is required and must be string
    body("username")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
      .withMessage("The username given does not meet requirements."),
  ];
};

validate.checkUserData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
