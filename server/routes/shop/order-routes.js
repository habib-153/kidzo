const express = require("express");

const {
  createOrder,
  cancelOrder,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.put("/cancel/:id", cancelOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.delete("/delete/:id", deleteOrder);
router.get("/details/:id", getOrderDetails);

module.exports = router;