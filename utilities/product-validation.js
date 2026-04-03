const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Product Data Validation Rules
 * ********************************* */
validate.addProductRules = () => {
  return [
    // name is required and must be string
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
      .withMessage("The name given does not meet requirements."),
    // category is required and must be string
    body("category")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
      .withMessage("The category given does not meet requirements."),
    // condition is required and must be string
    body("condition")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
      .withMessage("The condition given does not meet requirements."),
    // Validate year (integer, e.g., 1991)
    body("year")
      .isInt({ min: 1950, max: 2100 }) // adjust range as needed
      .withMessage("Year must be an integer between 1950 and 2100."),

    // Validate price (double/float, e.g., 150.5)
    body("price")
      .isFloat({ min: 0.01}) // adjust range as needed
      .withMessage("Price must be a valid number greater than 0."),

    // Validate quantity (integer, e.g., 2)
    body("quantity")
      .isInt() // adjust range as needed
      .withMessage("Quantity must be an integer."),
  ];
};

validate.checkProductData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
