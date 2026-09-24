import { dbManager } from '../services/dbManager.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items found in request' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    const order = await dbManager.createOrder({
      user: req.user,
      products,
      totalAmount: Number(totalAmount),
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('[OrderController.createOrder] Error:', error);
    res.status(400).json({ message: error.message || 'Could not place order' });
  }
};

// @desc    Get logged in user orders OR all orders if Admin
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const orders = await dbManager.getOrders(isAdmin ? null : req.user._id, isAdmin);
    res.json(orders);
  } catch (error) {
    console.error('[OrderController.getOrders] Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const order = await dbManager.getOrderById(req.params.id, req.user._id, isAdmin);

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found or unauthorized' });
    }
  } catch (error) {
    console.error('[OrderController.getOrderById] Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching order' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updated = await dbManager.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('[OrderController.updateOrderStatus] Error:', error);
    res.status(400).json({ message: error.message || 'Failed to update order status' });
  }
};
