const express = require("express");
const { addSubCategory, getSubCategoriesByCategory } = require("../../controllers/admin/sub-category-controller");

const router = express.Router();

router.post("/add", addSubCategory);
router.get("/get/:category", getSubCategoriesByCategory);

module.exports = router;