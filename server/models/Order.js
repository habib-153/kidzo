const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number,
      quantity: Number,
      size: String,
    },
  ],
  addressInfo: {
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: { type: String, default: "pending" },
  paymentMethod: { type: String, default: "cash on delivery" },
  paymentStatus: { type: String, default: "pending" },
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  orderUpdateDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);