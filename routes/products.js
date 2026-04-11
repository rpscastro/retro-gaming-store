const express = require("express");
const router = express.Router();
const productValidate = require("../utilities/product-validation");
const auth = require("../utilities/authenticate");

const productsController = require("../controllers/products");

router.get("/", productsController.getAllProducts);

router.get("/:id", productsController.getProductById);

router.post(
  "/",
  auth.isAuthenticated,
  productValidate.addProductRules(),
  productValidate.checkProductData,
  productsController.createProduct,
);

router.put(
  "/:id",
  auth.isAuthenticated,
  productValidate.addProductRules(),
  productValidate.checkProductData,
  productsController.updateProduct,
);

router.delete("/:id",
    auth.isAuthenticated,
    productsController.deleteProduct);

module.exports = router;
