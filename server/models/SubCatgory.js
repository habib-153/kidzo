const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema);