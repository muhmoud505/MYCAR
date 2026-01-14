const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/mycar';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@mycar.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@mycar.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const hash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@mycar.com',
      password: hash,
      name: 'Admin User',
      role: 'admin',
      isVerified: true,
      emailVerified: true,
      phoneVerified: true,
      profileCompleted: true
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@mycar.com');
    console.log('Password: admin123');
    console.log('User ID:', adminUser._id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
