import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      trekker_id: req.user.id // Assigning from auth token properly (Needs matching logic from schema ref)
    });
    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ trekker_id: req.user.id }).populate("schedule_id");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, trekker_id: req.user.id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.booking_status = "Cancelled";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/vendor
export const getVendorBookings = async (req, res) => {
  try {
    const schedules = await mongoose.model("TrekSchedule").find({ vendor_id: req.user.id });
    const scheduleIds = schedules.map(s => s._id);

    const bookings = await Booking.find({ schedule_id: { $in: scheduleIds } })
      .populate("trekker_id", "trekker_name")
      .populate("schedule_id");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
