const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedDemoData = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already contains records. Skipping auto-seeding.');
      return;
    }

    console.log('🌱 Seeding initial demo data...');

    // 1. Seed Users
    const createdUsers = await User.create([
      {
        name: 'ShopMini Admin',
        email: 'admin@shopmini.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Jane Customer',
        email: 'customer@shopmini.com',
        password: 'customer123',
        role: 'customer'
      }
    ]);

    // 2. Seed Categories
    const createdCategories = await Category.create([
      {
        name: 'Electronics',
        description: 'Smartphones, audio, laptops, and gadgets'
      },
      {
        name: 'Fashion',
        description: 'Designer apparel, jackets, and accessories'
      },
      {
        name: 'Shoes',
        description: 'Athletic sneakers, running shoes, and footwear'
      }
    ]);

    const [electronics, fashion, shoes] = createdCategories;

    // 3. Seed Products
    await Product.create([
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Over-ear Bluetooth headphones featuring industry-leading active noise cancellation, custom sound profiles, and up to 30 hours of battery life on a single charge.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        category: electronics._id,
        stock: 20
      },
      {
        name: 'Ultra-Slim OLED Smartwatch',
        description: 'Next-generation fitness and health companion with heart rate tracking, ECG, GPS navigation, and 50m water resistance.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        category: electronics._id,
        stock: 15
      },
      {
        name: 'Classic Vintage Denim Jacket',
        description: 'Timeless outerwear crafted from 100% heavyweight cotton denim. Features brass button closure and dual chest pockets.',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
        category: fashion._id,
        stock: 30
      },
      {
        name: 'Pro Performance Running Shoes',
        description: 'Engineered breathable mesh upper with responsive carbon-infused foam cushioning designed for long-distance marathon and everyday workouts.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        category: shoes._id,
        stock: 12
      }
    ]);

    console.log('✅ Demo Data Seeded Successfully!');
  } catch (error) {
    console.error('Error during auto-seeding:', error.message);
  }
};

module.exports = seedDemoData;
