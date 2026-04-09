const express = require("express");
const router = express.Router();
const summaryValidate = require("../utilities/summary-validation");
// const auth = require("../utilities/authenticate");

const summaryController = require("../controllers/summary");

router.get("/", summaryController.getAllSummaries);

router.get("/:id", summaryController.getSummaryById);

router.post(
  "/",
  //   auth.isAuthenticated,
  summaryValidate.addSummaryRules(),
  summaryValidate.checkSummaryData,
  summaryController.createSummary,
);

router.put(
  "/:id",
  //  auth.isAuthenticated,
  summaryValidate.addSummaryRules(),
  summaryValidate.checkSummaryData,
  summaryController.updateSummary,
);

router.delete("/:id",
    // auth.isAuthenticated,
    summaryController.deleteSummary);

module.exports = router;
