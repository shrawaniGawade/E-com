const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeder...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear existing records
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Previous records cleared.');

    // Seed Users
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

    const adminUser = createdUsers[0]._id;

    // Seed Categories
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

    // Seed Products
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

    console.log('✅ Demo Data Imported Successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account: admin@shopmini.com | Password: admin123');
    console.log('Customer Account: customer@shopmini.com | Password: customer123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('⚠️ All Database Records Destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`Destroy Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
