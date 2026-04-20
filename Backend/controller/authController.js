import User from "../models/User.js";
import Trekker from "../models/Trekker.js";
import Guide from "../models/Guide.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    // AT-02: Invalid or missing details validation
    if (!name || !email || !password || !role || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Name validation: must start with capital letter
    if (!/^[A-Z]/.test(name.trim())) {
      return res.status(400).json({ message: "Name must start with a capital letter" });
    }

    // Password validation: min 6 chars, uppercase, number, special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters and contain an uppercase letter, a number, and a special character" 
      });
    }

    // Email format validation
    if (!/^\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // AT-03: Duplicate email registration
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
        role: user.role,
        phone: user.phone || "",
        profile_image: user.profile_image || ""
      }
    });

  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let profileData = { user };

    if (user.role === "Guide") {
      profileData.guide = await Guide.findOne({ user_id: user._id });
    } else if (user.role === "LocalVendor") {
      profileData.vendor = await Vendor.findOne({ user_id: user._id });
    } else if (user.role === "Trekker") {
      profileData.trekker = await Trekker.findOne({ user_id: user._id });
    }

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, experience_years, license_no, address, company_name } = req.body;
    
    // 1. Update Base User
    const userUpdates = { name, phone };

    // Maintain consistency with AT-02 name validation
    if (name && !/^[A-Z]/.test(name.trim())) {
      return res.status(400).json({ message: "Name must start with a capital letter" });
    }

    if (req.file) {
      userUpdates.profile_image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userUpdates },
      { new: true }
    ).select("-password");

    // 2. Update Role Specific Data
    if (updatedUser.role === "Guide") {
      await Guide.findOneAndUpdate(
        { user_id: updatedUser._id },
        { $set: { experience_years: Number(experience_years), license_no } },
        { upsert: true }
      );
    } else if (updatedUser.role === "LocalVendor") {
       await Vendor.findOneAndUpdate(
         { user_id: updatedUser._id },
         { $set: { company_name } },
         { upsert: true }
       );
    } else if (updatedUser.role === "Trekker") {
       await Trekker.findOneAndUpdate(
         { user_id: updatedUser._id },
         { $set: { address } },
         { upsert: true }
       );
    }

    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};