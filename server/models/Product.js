const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    price: {
      type: Map,
      of: Number,
      required: true
    },
    sale_price: {
      type: Map,
      of: Number,
      required: true
    },
    category: { type: String, required: true },
    tags: { type: [String], required: true },
    inventory: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        inStock: { type: Boolean, required: true }
      }
    ],
    brand: String,
    totalStock: Number,
    averageReview: Number
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;