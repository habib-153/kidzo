const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    // console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Product data is required"
      });
    }

    const payload = req.body
    
    // Validate required fields
    if (!payload.name || !payload.description || !payload.category || !payload.variants?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const newProduct = new Product(payload);
    await newProduct.save();

    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
      error: error.message
    });
  }
};
//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      sortParams = 'price-lowtohigh', 
      ...otherFilters 
    } = req.query;

    // Build query object
    const query = {};
    
    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Add other filters
    Object.keys(otherFilters).forEach(key => {
      if (otherFilters[key]) {
        query[key] = { $in: otherFilters[key].split(',') };
      }
    });

    // Sorting logic
    let sort = {};
    switch(sortParams) {
      case 'price-lowtohigh':
        sort = { 'price': 1 };
        break;
      case 'price-hightolow':
        sort = { 'price': -1 };
        break;
      case 'newest':
        sort = { 'createdAt': -1 };
        break;
      default:
        sort = { 'createdAt': -1 };
    }

    // Fetch products with dynamic filtering and sorting
    const listOfProducts = await Product.find(query).sort(sort);

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
      error: e.message
    });
  }
};

// Add method to get subcategories
const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // First, check if subcategories exist in database
    const subcategories = await SubCategory.find({ category });

    // If no subcategories, create default ones based on existing products
    if (subcategories.length === 0) {
      const productSubcategories = await Product.distinct('subcategory', { category });
      
      // Create subcategories for each unique subcategory found in products
      const newSubcategories = await Promise.all(
        productSubcategories.map(async (subcategoryName) => {
          const newSubcategory = new SubCategory({
            name: subcategoryName,
            category: category
          });
          return newSubcategory.save();
        })
      );

      return res.status(200).json({
        success: true,
        data: newSubcategories
      });
    }

    res.status(200).json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subcategories",
      error: error.message
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle image upload if images are provided
    if (req.files?.Images) {
      const imageUploadPromises = req.files.Images.map((file) => imageUploadUtil(file.path));
      const imageUploadResults = await Promise.all(imageUploadPromises);
      updateData.images = imageUploadResults.map((result) => result.secure_url);
    }

    // Update product fields
    Object.assign(findProduct, updateData);

    await findProduct.save();

    res.status(200).json({ success: true, data: findProduct });
  } catch (e) {
    // console.log(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// adding color to product
const addColorToProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, images } = req.body;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Add color and images
    product.colors.push({ 
      name: color, 
      images: images 
    });

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding color",
      error: error.message
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  addColorToProduct,
  getSubcategoriesByCategory
};
