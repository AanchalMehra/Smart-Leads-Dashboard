import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL as string });
    
    //check if admin already exists
    if(existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);
    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL as string,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    process.exit(0);
  } 
  catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
