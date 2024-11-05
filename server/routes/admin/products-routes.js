const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const { multerUpload } = require("../../helpers/multer.config");
const { parseBody } = require("../../helpers/bodyparser");

const router = express.Router();

router.post("/upload-image", upload.fields("my_file"), handleImageUpload);
router.post("/add", multerUpload.fields([{name: 'Images'}]), parseBody, addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
