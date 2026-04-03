const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Users']
  // Implementation for getting all users
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .find()
      .toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: error.message || error });
  }
};

const getUserById = async (req, res) => {
  // #swagger.tags = ['Users']
  // Implementation for getting a user by ID
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid user id to find a user.");
  }
  try {
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error", error);
    res.status(500).json({ message: error.message || error });
  }
};

const createUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // Implementation for creating a new user
  const userData = {
    github_id: req.body.github_id,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    name: req.body.name,
    username: req.body.username,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .insertOne(userData);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while creating the user." });
    }
  } catch (error) {
    console.error("createUser error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // Implementation for updating an existing user
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid user id to update a user.");
  }
  const userId = new ObjectId(req.params.id);
  const userData = {
    github_id: req.body.github_id,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    name: req.body.name,
    username: req.body.username,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .replaceOne({ _id: userId }, userData);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while updating the user." });
    }
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // Implementation for deleting a user
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid user id to delete a user.");
  }

  const userId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .deleteOne({ _id: userId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: "Some error occurred while deleting the user." });
    }
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
