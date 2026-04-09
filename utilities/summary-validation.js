const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Summary Data Validation Rules
 * ********************************* */
validate.addSummaryRules = () => {
 return [
   body("salesYear")
     .isNumeric()
     .isInt({ min: 1900 }) // adjust min/max as needed
     .withMessage("Year must be a valid integer and greater than 1900."),

   body("salesMonth")
     .isNumeric()
     .isInt({ min: 1, max: 12 })
     .withMessage("Month must be an integer between 1 and 12."),

   body("totalUnitsSold")
     .isNumeric()
     .isInt({ min: 0 })
     .withMessage("Total units sold must be a non-negative integer."),

   body("totalSalesCount")
     .isNumeric()
     .isInt({ min: 0 })
     .withMessage("Total sales count must be a non-negative integer."),

   body("totalSalesAmount")
     .isNumeric()
     .isFloat({ min: 0 })
     .withMessage("Total sales amount must be a non-negative number."),

   body("totalExpensesAmount")
     .isNumeric()
     .isFloat({ min: 0 })
     .withMessage("Total expenses must be a non-negative number."),
 ];

};

validate.checkSummaryData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });    
  }
  next();
};

module.exports = validate;
