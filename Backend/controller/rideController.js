import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// POST /api/rides
export const createRide = async (req, res) => {
  try {
    const { ride_name, pickup_location, drop_location, departure_time, price, total_seats, trek_id } = req.body;
    
    const newRide = new Ride({
      vendor_id: req.user.id,
      trek_id: trek_id || null,
      ride_name: ride_name || "Shared Ride",
      pickup_location,
      drop_location,
      departure_time,
      price,
      total_seats,
      available_seats: total_seats
    });

    const savedRide = await newRide.save();

    // Create Notification
    await Notification.create({
      user_id: req.user.id,
      message: `You created ride: ${savedRide.ride_name}`,
      type: "ride_created"
    });

    res.status(201).json(savedRide);
  } catch (error) {
    console.error(`Create Ride Error: ${error.message}`);
    res.status(500).json({ message: "Failed to create ride" });
  }
};

// GET /api/rides
export const getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ 
        available_seats: { $gt: 0 },
        departure_time: { $gte: new Date() }
    }).populate("vendor_id", "name"); 
    
    res.status(200).json(rides);
  } catch (error) {
    console.error(`Get Rides Error: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
};

// GET /api/rides/vendor
export const getVendorRides = async (req, res) => {
  try {
    const rides = await Ride.find({ vendor_id: req.user.id }).sort({ departure_time: -1 });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your rides" });
  }
};

// PUT /api/rides/:id
export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.vendor_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own rides" });
    }

    // Ensure we don't reduce total seats below booked seats
    if (req.body.total_seats) {
       const bookedSeats = ride.total_seats - ride.available_seats;
       if (req.body.total_seats < bookedSeats) {
         return res.status(400).json({ message: `Cannot reduce total seats below currently booked seats (${bookedSeats})` });
       }
       req.body.available_seats = req.body.total_seats - bookedSeats;
    }

    const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: "Failed to update ride" });
  }
};

// DELETE /api/rides/:id
export const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.vendor_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Check if there are active bookings
    const activeBookings = await Booking.find({ ride_id: req.params.id, booking_status: { $in: ["Pending", "Confirmed"] } });
    if (activeBookings.length > 0) {
      return res.status(400).json({ message: `Cannot delete ride. It has ${activeBookings.length} active bookings!` });
    }

    await ride.deleteOne();
    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ride" });
  }
};

// GET /api/rides/earnings
export const getVendorEarnings = async (req, res) => {
  try {
    const vendorId = new mongoose.Types.ObjectId(req.user.id);

    // Calculate sum of (seats * ride.price) for all confirmed/pending bookings of rides owned by this vendor
    const earningsData = await Booking.aggregate([
      {
        $match: { booking_status: { $in: ["Pending", "Confirmed", "Completed"] } }
      },
      {
        $lookup: {
          from: "rides",
          localField: "ride_id",
          foreignField: "_id",
          as: "ride"
        }
      },
      {
        $unwind: "$ride"
      },
      {
        $match: { "ride.vendor_id": vendorId }
      },
      {
        $group: {
          _id: "$ride._id",
          ride_name: { $first: "$ride.ride_name" },
          ride_price: { $first: "$ride.price" },
          total_seats_booked: { $sum: "$seats" },
          ride_earnings: { $sum: { $multiply: ["$seats", "$ride.price"] } }
        }
      }
    ]);

    const totalEarnings = earningsData.reduce((acc, ride) => acc + ride.ride_earnings, 0);

    res.status(200).json({ totalEarnings, earningsPerRide: earningsData });
  } catch (error) {
    console.error("Earnings Error:", error);
    res.status(500).json({ message: "Failed to fetch earnings" });
  }
};
