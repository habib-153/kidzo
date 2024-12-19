const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  subcategory: { 
    type: String 
  },
  brand: String,
  tags: { 
    type: [String], 
    default: ['product'] 
  },
  variants: [{
    color: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    sizes: [{
      size: { 
        type: String, 
        required: true 
      },
      price: { 
        type: Number, 
        required: true,
        min: 0
      },
      salePrice: { 
        type: Number,
        min: 0,
      },
      quantity: { 
        type: Number, 
        required: true,
        min: 0,
        default: 0
      },
      inStock: {
        type: Boolean,
        default: function() {
          return this.quantity > 0;
        }
      }
    }]
  }],
  totalStock: {
    type: Number,
    default: 0
  },
  averageReview: {
    type: Number,
    default: 0
  },
  featured: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Calculate total stock before saving
ProductSchema.pre('save', function(next) {
  this.totalStock = this.variants.reduce((total, variant) => {
    return total + variant.sizes.reduce((sizeTotal, size) => {
      return sizeTotal + size.quantity;
    }, 0);
  }, 0);
  next();
});

module.exports = mongoose.model('Product', ProductSchema);