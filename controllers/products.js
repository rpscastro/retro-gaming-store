const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllProducts = async (req, res) => {
  // #swagger.tags = ['Products']
  // Implementation for getting all products
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .find()
      .toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("getAllProducts error:", error);
    res.status(500).json({ message: error.message || error });
  }
};

const getProductById = async (req, res) => {
  // #swagger.tags = ['Products']
  // Implementation for getting a product by ID
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid product id to find a product.");
  }
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .findOne({ _id: productId });
    if (!result) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ message: error.message || error });
  }
};

const createProduct = async (req, res) => {
  // #swagger.tags = ['Products']
  // Implementation for creating a new product
  const productData = {
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    category: req.body.category,
    condition: req.body.condition,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
    quantity: req.body.quantity,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .insertOne(productData);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while creating the product." });
    }
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  // #swagger.tags = ['Products']
  // Implementation for updating an existing product
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid product id to update a product.");
  }
  const productId = new ObjectId(req.params.id);
  const productData = {
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    category: req.body.category,
    condition: req.body.condition,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
    quantity: req.body.quantity,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .replaceOne({ _id: productId }, productData);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while updating the product." });
    }
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  // #swagger.tags = ['Products']
  // Implementation for deleting a product
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid product id to delete a product.");
  }
  const productId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .deleteOne({ _id: productId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while deleting the product." });
    }
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
