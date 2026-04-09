const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllFavorites = async (req, res) => {
  // #swagger.tags = ['Favorites']
  // Implementation for getting all favorites
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("favorites")
      .find()
      .toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("getAllFavorites error:", error);
    res.status(500).json({ message: error.message || error });
  }
};

const getFavoriteById = async (req, res) => {
  // #swagger.tags = ['Favorites']
  // Implementation for getting a favorite by ID
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid favorite id to find a favorite.");
  }
  try {
    const favoriteId = new ObjectId(req.params.id);
    const favorite = await mongodb
      .getDatabase()
      .db()
      .collection("favorites")
      .findOne({ _id: favoriteId });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found." });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(favorite);
  } catch (error) {
    console.error("getFavoriteById error", error);
    res.status(500).json({ message: error.message || error });
  }
};

const createFavorite = async (req, res) => {
  // #swagger.tags = ['Favorites']
  // Implementation for creating a new favorite
  const favoriteData = {
    userId: new ObjectId(req.body.userId),
    productId: new ObjectId(req.body.productId),
    createdAt: new Date(),
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("favorites")
      .insertOne(favoriteData);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while creating the favorite." });
    }
  } catch (error) {
    console.error("createFavorite error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const updateFavorite = async (req, res) => {
  // #swagger.tags = ['Favorites']
  // Implementation for updating an existing favorite
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid favorite id to update a favorite.");
  }
  const favoriteId = new ObjectId(req.params.id);
  const favoriteData = {
    userId: new ObjectId(req.body.userId),
    productId: new ObjectId(req.body.productId),
    createdAt: new Date(),
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("favorites")
      .replaceOne({ _id: favoriteId }, favoriteData);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while updating the favorite." });
    }
  } catch (error) {
    console.error("updateFavorite error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteFavorite = async (req, res) => {
  // #swagger.tags = ['Favorites']
  // Implementation for deleting a favorite
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid favorite id to delete a favorite.");
  }

  const favoriteId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("favorites")
      .deleteOne({ _id: favoriteId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while deleting the favorite." });
    }
  } catch (error) {
    console.error("deleteFavorite error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
};
