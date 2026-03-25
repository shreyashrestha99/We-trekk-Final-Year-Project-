import User from "../models/User.js";
import Trekker from "../models/Trekker.js";
import Guide from "../models/Guide.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log("Register called!");
    console.log("Request body:", req.body);

    const { name, email, password, role, address } = req.body;

    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);
    
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed!");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log("User created:", newUser);

    if (role === "Trekker") {
      await Trekker.create({
        user_id: newUser._id,
        trekker_name: name,
        address: address || ""
      });
      console.log("Trekker profile created!");
    } else if (role === "Guide") {
      await Guide.create({
        user_id: newUser._id,
        experience_years: 0
      });
      console.log("Guide profile created!");
    } else if (role === "LocalVendor") {
      await Vendor.create({
        user_id: newUser._id,
        company_name: name
      });
      console.log("Vendor profile created!");
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token generated!");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};