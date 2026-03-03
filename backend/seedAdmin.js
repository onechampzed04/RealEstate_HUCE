// seedAdmin.js
import bcrypt from "bcrypt";
import User from "./models/UserModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    const hash = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Super Admin",
      email: "admin1@gmail.com",
      password: "123456",
      role: "ADMIN",
    });

    console.log("Admin created");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
