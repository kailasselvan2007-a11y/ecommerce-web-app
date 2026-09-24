import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Default initial products
export const initialProducts = [
  {
    name: 'AcousticPro Wireless Noise-Cancelling Headphones',
    description: 'Studio-grade over-ear Bluetooth headphones with active hybrid noise cancellation, 40h battery life, plush memory foam earcups, and crystal-clear microphone audio.',
    price: 199.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 24,
  },
  {
    name: 'Apex Precision Mechanical Keyboard',
    description: 'Custom compact 75% mechanical keyboard with lubricated tactile switches, sound dampening silicone foam, hot-swappable sockets, and durable PBT keycaps.',
    price: 129.50,
    category: 'Workspace',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    stock: 18,
  },
  {
    name: 'Horizon Smart Fitness Watch 2',
    description: 'Ultra-thin aerospace aluminum body with sapphire glass, 1.4-inch AMOLED display, SpO2 sensor, continuous heart rate tracking, and 7-day battery.',
    price: 159.00,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    stock: 35,
  },
  {
    name: 'Nomad Commuter Weatherproof Backpack',
    description: 'Minimalist 22L urban backpack crafted from water-repellent Cordura nylon, dedicated padded 16-inch laptop compartment, and ergonomic airflow back panel.',
    price: 89.95,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    stock: 40,
  },
  {
    name: 'Lumina Arc Studio Desk Lamp',
    description: 'Architectural aluminum LED desk lamp featuring touch slider dimming, 5 color temperature presets, USB-C 15W fast pass-through charging, and glare-free asymmetric optical lens.',
    price: 74.99,
    category: 'Workspace',
    image: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=800&q=80',
    stock: 15,
  },
  {
    name: 'PulseFlow True Wireless Earbuds',
    description: 'Compact wireless earbuds with deep bass response, IPX5 water resistance, transparency mode, wireless charging case, and 32 hours total playtime.',
    price: 69.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    stock: 50,
  },
  {
    name: 'Minimalist Leather Bi-Fold Wallet',
    description: 'Handcrafted full-grain Italian leather wallet with RFID blocking layer, holds 8 cards and flat currency notes with an ultra-slim profile.',
    price: 45.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    stock: 30,
  },
  {
    name: 'ErgoForm Walnut Monitor Stand',
    description: 'Solid American walnut desktop riser supporting up to 45kg, elevates display to ergonomic eye-level with clearance for full-size keyboard storage underneath.',
    price: 64.00,
    category: 'Workspace',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    stock: 12,
  },
];

let isMongooseConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopease';
  try {
    mongoose.set('strictQuery', false);
    // Try connecting with a 2.5s timeout so startup is instant if local daemon is absent
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongooseConnected = true;
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isMongooseConnected = false;
    console.log(`[Database] MongoDB connection failed or URI unreachable (${err.message}).`);
    console.log(`[Database] Falling back to built-in resilient file storage with pre-seeded data.`);
    return false;
  }
};

export const getDBStatus = () => ({
  isMongooseConnected,
  type: isMongooseConnected ? 'mongodb' : 'embedded-store',
});
