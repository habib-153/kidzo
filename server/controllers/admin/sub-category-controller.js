const SubCategory = require('../../models/SubCategory');

const addSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    
    // Check if sub-category already exists for this category
    const existingSubCategory = await SubCategory.findOne({ 
      name, 
      category 
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "Sub-category already exists"
      });
    }

    const newSubCategory = new SubCategory({
      name,
      category,
      description
    });

    await newSubCategory.save();

    res.status(201).json({
      success: true,
      data: newSubCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating sub-category",
      error: error.message
    });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const subCategories = await SubCategory.find({ category });

    res.status(200).json({
      success: true,
      data: subCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sub-categories",
      error: error.message
    });
  }
};

module.exports = {
  addSubCategory,
  getSubCategoriesByCategory
};