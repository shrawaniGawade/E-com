const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with category filter & search support
// @route   GET /api/products
// @access  Public
// @query   category (Category ID or Category Name), search (Keyword)
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category (either category ID or category name)
    if (category && category !== 'All' && category !== '') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, 'i') }
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category name doesn't exist, return empty result
          return res.status(200).json({
            success: true,
            count: 0,
            data: []
          });
        }
      }
    }

    // Filter by search keyword in name or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name description'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin Only
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !image || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, image, category, and stock'
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      image: image.trim(),
      category: categoryDoc._id,
      stock: numericStock
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'category',
      'name description'
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin Only
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, image, category, stock } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (image !== undefined) product.image = image.trim();

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number'
        });
      }
      product.price = numericPrice;
    }

    if (stock !== undefined) {
      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative'
        });
      }
      product.stock = numericStock;
    }

    if (category !== undefined) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist'
        });
      }
      product.category = categoryDoc._id;
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate(
      'category',
      'name description'
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin Only
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
