const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getTopSellingProducts
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/top-selling", getTopSellingProducts);

module.exports = router;
