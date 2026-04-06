import User from "../models/User.js";
import Trekker from "../models/Trekker.js";
import Guide from "../models/Guide.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    if (role === "Trekker") {
      await Trekker.create({
        user_id: newUser._id,
        trekker_name: name,
        address: address || ""
      });
    } else if (role === "Guide") {
      await Guide.create({
        user_id: newUser._id,
        experience_years: 0
      });
    } else if (role === "LocalVendor") {
      await Vendor.create({
        user_id: newUser._id,
        company_name: name
      });
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: "Internal server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Internal server error during login" });
  }
};