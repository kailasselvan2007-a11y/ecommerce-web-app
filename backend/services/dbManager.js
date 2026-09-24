import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { initialProducts, getDBStatus } from '../config/db.js';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Helper to generate realistic MongoDB-like Hex IDs
export const generateId = () => {
  return new mongoose.Types.ObjectId().toString();
};

class StorageEngine {
  constructor() {
    this.memory = {
      users: [],
      products: [],
      orders: [],
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.memory = JSON.parse(raw);
      } else {
        this.seedDefaults();
        this.persist();
      }
    } catch (e) {
      console.warn('[StorageEngine] Error loading JSON store, initializing fresh memory store:', e.message);
      this.seedDefaults();
    }
  }

  seedDefaults() {
    const adminSalt = bcrypt.genSaltSync(10);
    const userSalt = bcrypt.genSaltSync(10);

    const adminUser = {
      _id: generateId(),
      name: 'Store Administrator',
      email: 'admin@shopease.com',
      password: bcrypt.hashSync('admin123', adminSalt),
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const regularUser = {
      _id: generateId(),
      name: 'Alex Johnson',
      email: 'user@shopease.com',
      password: bcrypt.hashSync('user123', userSalt),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    const seededProducts = initialProducts.map((p) => ({
      _id: generateId(),
      ...p,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    this.memory = {
      users: [adminUser, regularUser],
      products: seededProducts,
      orders: [],
    };
  }

  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.memory, null, 2), 'utf-8');
    } catch (err) {
      console.error('[StorageEngine] Failed to write to disk:', err.message);
    }
  }

  // User ops
  async findUserByEmail(email) {
    if (getDBStatus().isMongooseConnected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return this.memory.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    if (getDBStatus().isMongooseConnected) {
      return await User.findById(id).select('-password');
    }
    const user = this.memory.users.find((u) => u._id === id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async findUserByIdWithPassword(id) {
    if (getDBStatus().isMongooseConnected) {
      return await User.findById(id);
    }
    return this.memory.users.find((u) => u._id === id) || null;
  }

  async createUser(userData) {
    if (getDBStatus().isMongooseConnected) {
      const user = new User(userData);
      return await user.save();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
    };
    this.memory.users.push(newUser);
    this.persist();
    return newUser;
  }

  async updateUser(id, updateData) {
    if (getDBStatus().isMongooseConnected) {
      const user = await User.findById(id);
      if (!user) return null;
      if (updateData.name) user.name = updateData.name;
      if (updateData.email) user.email = updateData.email;
      if (updateData.password) user.password = updateData.password;
      return await user.save();
    }
    const userIndex = this.memory.users.findIndex((u) => u._id === id);
    if (userIndex === -1) return null;
    const user = this.memory.users[userIndex];
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email.toLowerCase();
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }
    this.persist();
    const { password, ...rest } = user;
    return rest;
  }

  // Product ops
  async getProducts({ category, search } = {}) {
    if (getDBStatus().isMongooseConnected) {
      const query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      return await Product.find(query).sort({ createdAt: -1 });
    }

    let items = [...this.memory.products];
    if (category && category !== 'All') {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const query = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProductById(id) {
    if (getDBStatus().isMongooseConnected) {
      return await Product.findById(id);
    }
    return this.memory.products.find((p) => p._id === id) || null;
  }

  async createProduct(productData) {
    if (getDBStatus().isMongooseConnected) {
      const product = new Product(productData);
      return await product.save();
    }
    const newProduct = {
      _id: generateId(),
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      image: productData.image,
      stock: Number(productData.stock),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memory.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  async updateProduct(id, productData) {
    if (getDBStatus().isMongooseConnected) {
      return await Product.findByIdAndUpdate(
        id,
        { ...productData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
    }
    const index = this.memory.products.findIndex((p) => p._id === id);
    if (index === -1) return null;
    this.memory.products[index] = {
      ...this.memory.products[index],
      ...productData,
      price: productData.price !== undefined ? Number(productData.price) : this.memory.products[index].price,
      stock: productData.stock !== undefined ? Number(productData.stock) : this.memory.products[index].stock,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.memory.products[index];
  }

  async deleteProduct(id) {
    if (getDBStatus().isMongooseConnected) {
      return await Product.findByIdAndDelete(id);
    }
    const index = this.memory.products.findIndex((p) => p._id === id);
    if (index === -1) return null;
    const [deleted] = this.memory.products.splice(index, 1);
    this.persist();
    return deleted;
  }

  // Order ops
  async createOrder({ user, products, totalAmount, shippingAddress }) {
    // Validate and deduct stock
    for (const item of products) {
      const prod = await this.getProductById(item.product);
      if (!prod) {
        throw new Error(`Product not found: ${item.name || item.product}`);
      }
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stock}`);
      }
    }

    // Deduct stock
    for (const item of products) {
      const prod = await this.getProductById(item.product);
      await this.updateProduct(item.product, { stock: prod.stock - item.quantity });
    }

    if (getDBStatus().isMongooseConnected) {
      const order = new Order({
        user: user._id || user,
        products,
        totalAmount,
        shippingAddress,
        status: 'Pending',
      });
      return await order.save();
    }

    const newOrder = {
      _id: generateId(),
      user: typeof user === 'object' ? user._id : user,
      userSnapshot: typeof user === 'object' ? { name: user.name, email: user.email } : null,
      products,
      totalAmount,
      shippingAddress,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memory.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  async getOrders(userId = null, isAdmin = false) {
    if (getDBStatus().isMongooseConnected) {
      if (isAdmin && !userId) {
        return await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
      }
      return await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    let list = [...this.memory.orders];
    if (!isAdmin && userId) {
      list = list.filter((o) => o.user === userId);
    }
    // Populate user info for orders
    return list.map((order) => {
      const userObj = this.memory.users.find((u) => u._id === order.user);
      return {
        ...order,
        user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email } : (order.userSnapshot || { _id: order.user, name: 'Customer', email: 'customer@store.com' }),
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(id, userId = null, isAdmin = false) {
    if (getDBStatus().isMongooseConnected) {
      const query = { _id: id };
      if (!isAdmin && userId) {
        query.user = userId;
      }
      return await Order.findOne(query).populate('user', 'name email');
    }

    const order = this.memory.orders.find((o) => o._id === id);
    if (!order) return null;
    if (!isAdmin && userId && order.user !== userId) {
      return null;
    }
    const userObj = this.memory.users.find((u) => u._id === order.user);
    return {
      ...order,
      user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email } : (order.userSnapshot || { _id: order.user, name: 'Customer', email: 'customer@store.com' }),
    };
  }

  async updateOrderStatus(id, status) {
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (getDBStatus().isMongooseConnected) {
      return await Order.findByIdAndUpdate(
        id,
        { status, updatedAt: Date.now() },
        { new: true }
      ).populate('user', 'name email');
    }

    const order = this.memory.orders.find((o) => o._id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.persist();

    const userObj = this.memory.users.find((u) => u._id === order.user);
    return {
      ...order,
      user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email } : (order.userSnapshot || { _id: order.user, name: 'Customer', email: 'customer@store.com' }),
    };
  }

  // Dashboard Stats
  async getAdminStats() {
    if (getDBStatus().isMongooseConnected) {
      const totalProducts = await Product.countDocuments();
      const totalUsers = await User.countDocuments();
      const orders = await Order.find();
      const totalOrders = orders.length;
      const totalSales = orders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return { totalProducts, totalUsers, totalOrders, totalSales };
    }

    const totalProducts = this.memory.products.length;
    const totalUsers = this.memory.users.length;
    const totalOrders = this.memory.orders.length;
    const totalSales = this.memory.orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return { totalProducts, totalUsers, totalOrders, totalSales };
  }
}

export const dbManager = new StorageEngine();
