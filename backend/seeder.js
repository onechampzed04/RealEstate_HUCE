
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { properties } from './data/properties.js';
import Property from './models/PropertyModel.js';
import User from './models/UserModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();

    await Property.insertMany(properties);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
