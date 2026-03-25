import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "../models/User.js";

// This makes sure .env is found correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

const createAdmin = async () => {
  try {
    // Check if MONGO_URI is being read
    console.log("Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database...");

    const existing = await User.findOne({ role: "Admin" });
    if (existing) {
      console.log("Admin already exists!");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@wetrekk.com",
      password: hashedPassword,
      role: "Admin"
    });

    console.log("Admin created successfully!");
    console.log("Email: admin@wetrekk.com");
    console.log("Password: admin123");
    process.exit();

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();