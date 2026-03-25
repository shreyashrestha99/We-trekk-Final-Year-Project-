import express from "express";
import User from "../models/User.js";
import Guide from "../models/Guide.js";
import Vendor from "../models/Vendor.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// Get all users
router.get("/users", protect, authorize("Admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending verifications
router.get("/pending-verifications", protect, authorize("Admin"), async (req, res) => {
  try {
    const guides = await Guide.find({ is_verified: false })
      .populate("user_id", "name email role");
    const vendors = await Vendor.find({ is_verified: false })
      .populate("user_id", "name email role");

    const pending = [
      ...guides.map(g => ({
        _id: g.user_id._id,
        name: g.user_id.name,
        email: g.user_id.email,
        role: "Guide",
        profile_id: g._id
      })),
      ...vendors.map(v => ({
        _id: v.user_id._id,
        name: v.user_id.name,
        email: v.user_id.email,
        role: "LocalVendor",
        profile_id: v._id
      }))
    ];

    res.json({ users: pending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify user
router.put("/verify/:userId", protect, authorize("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "Guide") {
      await Guide.findOneAndUpdate(
        { user_id: user._id },
        { is_verified: true }
      );
    } else if (user.role === "LocalVendor") {
      await Vendor.findOneAndUpdate(
        { user_id: user._id },
        { is_verified: true }
      );
    }

    res.json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all disputes
router.get("/disputes", protect, authorize("Admin"), async (req, res) => {
  try {
    const disputes = await Booking.find({ dispute_status: { $ne: "None" } }).populate("trekker_id").populate("schedule_id");
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resolve dispute
router.put("/disputes/:bookingId", protect, authorize("Admin"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.dispute_status = "Resolved";
    await booking.save();
    
    res.json({ message: "Dispute resolved", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;