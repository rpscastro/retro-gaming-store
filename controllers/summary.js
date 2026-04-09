const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllSummaries = async (req, res) => {
  // #swagger.tags = ['Summaries']
  // Implementation for getting all summaries
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("orders-summary")
      .find()
      .toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("getAllSummaries error:", error);
    res.status(500).json({ message: error.message || error });
  }
};

const getSummaryById = async (req, res) => {
  // #swagger.tags = ['Summaries']
  // Implementation for getting a summary by ID
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid summary id to find a summary.");
  }
  try {
    const summaryId = new ObjectId(req.params.id);
    const summary = await mongodb
      .getDatabase()
      .db()
      .collection("orders-summary")
      .findOne({ _id: summaryId });
    if (!summary) {
      return res.status(404).json({ message: "Summary not found." });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(summary);
  } catch (error) {
    console.error("getSummaryById error", error);
    res.status(500).json({ message: error.message || error });
  }
};

const createSummary = async (req, res) => {
  // #swagger.tags = ['Summaries']
  // Implementation for creating a new summary
  const summaryData = {
    salesYear: Number(req.body.salesYear),
    salesMonth: Number(req.body.salesMonth),
    totalUnitsSold: Number(req.body.totalUnitsSold),
    totalSalesCount: Number(req.body.totalSalesCount),
    totalSalesAmount: Number(req.body.totalSalesAmount),
    totalExpensesAmount: Number(req.body.totalExpensesAmount),
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("orders-summary")
      .insertOne(summaryData);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while creating the summary entry." });
    }
  } catch (error) {
    console.error("createSummary error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const updateSummary = async (req, res) => {
  // #swagger.tags = ['Summaries']
  // Implementation for updating an existing summary
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid summary id to update a summary.");
  }
  const summaryId = new ObjectId(req.params.id);
  const summaryData = {
    salesYear: Number(req.body.salesYear),
    salesMonth: Number(req.body.salesMonth),
    totalUnitsSold: Number(req.body.totalUnitsSold),
    totalSalesCount: Number(req.body.totalSalesCount),
    totalSalesAmount: Number(req.body.totalSalesAmount),
    totalExpensesAmount: Number(req.body.totalExpensesAmount),
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("orders-summary")
      .replaceOne({ _id: summaryId }, summaryData);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while updating the favorite." });
    }
  } catch (error) {
    console.error("updateSummary error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteSummary = async (req, res) => {
  // #swagger.tags = ['Summaries']
  // Implementation for deleting a summary
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid summary id to delete a summary.");
  }

  const summaryId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("orders-summary")
      .deleteOne({ _id: summaryId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while deleting the summary." });
    }
  } catch (error) {
    console.error("deleteSummary error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllSummaries,
  getSummaryById,
  createSummary,
  updateSummary,
  deleteSummary,
};
