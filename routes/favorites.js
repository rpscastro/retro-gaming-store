const express = require("express");
const router = express.Router();
const favoriteValidate = require("../utilities/favorite-validation");
// const auth = require("../utilities/authenticate");

const favoritesController = require("../controllers/favorites");

router.get("/", favoritesController.getAllFavorites);

router.get("/:id", favoritesController.getFavoriteById);

router.post(
  "/",
  //   auth.isAuthenticated,
  favoriteValidate.addFavoriteRules(),
  favoriteValidate.checkFavoriteData,
  favoritesController.createFavorite,
);

router.put(
  "/:id",
  //  auth.isAuthenticated,
  favoriteValidate.addFavoriteRules(),
  favoriteValidate.checkFavoriteData,
  favoritesController.updateFavorite,
);

router.delete("/:id",
    // auth.isAuthenticated,
    favoritesController.deleteFavorite);

module.exports = router;
