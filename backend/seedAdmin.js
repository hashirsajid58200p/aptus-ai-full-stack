/**
 * seedAdmin.js — Run this ONCE to create the admin account in MongoDB.
 * Usage: node seedAdmin.js
 * After running successfully, delete or do not re-run this file.
 */
require('dotenv').config({ path: './config/.env' });
const mongoose = require('mongoose');
const Admin = require('./models/adminModel');

const ADMIN_EMAIL = 'aptusai@example.com';
const ADMIN_PASSWORD = 'AptusAI2026!';

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin already exists. Skipping seed.');
      process.exit(0);
    }

    const admin = await Admin.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    console.log(`✅ Admin created successfully: ${admin.email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
