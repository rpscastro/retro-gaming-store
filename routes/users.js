const express = require("express");
const router = express.Router();
const userValidate = require("../utilities/user-validation");
// const auth = require("../utilities/authenticate");

const usersController = require("../controllers/users");

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getUserById);

router.post(
  "/",
//   auth.isAuthenticated,
  userValidate.addUserRules(),
  userValidate.checkUserData,
  usersController.createUser,
);

router.put(
  "/:id",
//   auth.isAuthenticated,
  userValidate.addUserRules(),
  userValidate.checkUserData,
  usersController.updateUser,
);

router.delete("/:id",
    // auth.isAuthenticated,
    usersController.deleteUser);

module.exports = router;
