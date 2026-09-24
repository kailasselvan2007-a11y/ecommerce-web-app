import { dbManager } from '../services/dbManager.js';

// @desc    Fetch all products with optional filtering & search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const products = await dbManager.getProducts({ category, search });
    res.json(products);
  } catch (error) {
    console.error('[ProductController.getProducts] Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await dbManager.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('[ProductController.getProductById] Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, description, price, category, image, and stock',
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({ message: 'Price and stock must be non-negative numbers' });
    }

    const createdProduct = await dbManager.createProduct({
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock),
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('[ProductController.createProduct] Error:', error);
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    const existing = await dbManager.getProductById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await dbManager.updateProduct(req.params.id, {
      name: name ?? existing.name,
      description: description ?? existing.description,
      price: price !== undefined ? Number(price) : existing.price,
      category: category ?? existing.category,
      image: image ?? existing.image,
      stock: stock !== undefined ? Number(stock) : existing.stock,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('[ProductController.updateProduct] Error:', error);
    res.status(500).json({ message: error.message || 'Failed to update product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const existing = await dbManager.getProductById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await dbManager.deleteProduct(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('[ProductController.deleteProduct] Error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete product' });
  }
};
