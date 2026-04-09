import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// POST /api/bookings (For Trek bookings)
export const createBooking = async (req, res) => {
  try {
    const { trek_schedule_id, seats } = req.body;
    const requestedSeats = Number(seats) || 1;

    // 1. Fetch TrekSchedule explicitly populating trek to get name
    const schedule = await mongoose.model("TrekSchedule").findById(trek_schedule_id).populate("trek_id");
    if (!schedule) {
      return res.status(404).json({ message: "TrekSchedule not found" });
    }

    // 2. Check available_seats
    if (schedule.available_seats < requestedSeats) {
       return res.status(400).json({ message: `Not enough seats available. Only ${schedule.available_seats} remaining.` });
    }

    // 3. Subtract seats
    schedule.available_seats -= requestedSeats;
    
    // 4. Save updated TrekSchedule
    await schedule.save();

    // 5. Create booking
    const booking = new Booking({
      user_id: req.user.id,
      trek_schedule_id: schedule._id,
      seats: requestedSeats
    });
    const createdBooking = await booking.save();

    // 6. Log notification securely to the Guide
    await Notification.create({
      user_id: schedule.guide_id,
      message: `A trekker booked ${requestedSeats} seat(s) for your "${schedule.trek_id.trek_name}" trek departing on ${new Date(schedule.start_date).toLocaleDateString()}.`,
      type: "booking"
    });

    // Notify Trekker (User)
    await Notification.create({
      user_id: req.user.id,
      message: `You successfully reserved ${requestedSeats} seat(s) for the "${schedule.trek_id.trek_name}" trek departing on ${new Date(schedule.start_date).toLocaleDateString()}.`,
      type: "booking"
    });

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/bookings/ride/:rideId
export const bookRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const { seats, seat_numbers } = req.body;
    const requestedSeats = Number(seats) || 1;

    const ride = await mongoose.model("Ride").findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.available_seats < requestedSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Check if any seats are already booked
    const alreadyBooked = seat_numbers.some(s => ride.booked_seats.includes(s));
    if (alreadyBooked) {
       return res.status(400).json({ message: "One or more selected seats are already booked." });
    }

    // Deduct seats and update booked_seats array
    ride.available_seats -= requestedSeats;
    ride.booked_seats.push(...seat_numbers);
    await ride.save();

    // Create booking record
    const booking = new Booking({
      user_id: req.user.id,
      ride_id: ride._id,
      seats: requestedSeats,
      seat_numbers: seat_numbers
    });

    await booking.save();
    
    // Notification to vendor
    await Notification.create({
      user_id: ride.vendor_id,
      message: `A user booked ${requestedSeats} seat(s) on your ride: ${ride.ride_name}`,
      type: "booking"
    });

    // Notify Trekker (User)
    await Notification.create({
      user_id: req.user.id,
      message: `You successfully reserved ${requestedSeats} seat(s) on the ride: ${ride.ride_name}`,
      type: "booking"
    });

    res.status(201).json({ message: "Ride booked successfully!", booking });
  } catch (error) {
    console.error(`Book Ride Error: ${error.message}`);
    res.status(500).json({ message: "Failed to book ride" });
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id })
      .populate({
         path: "trek_schedule_id",
         populate: { path: "trek_id" }
      })
      .populate({
         path: "ride_id",
         populate: { path: "trek_id" }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/guide (Get Bookings for a Guide's TrekSchedules)
export const getGuideBookings = async (req, res) => {
  try {
    // 1. Locate all schedules belonging to Guide
    const schedules = await mongoose.model("TrekSchedule").find({ guide_id: req.user.id });
    const scheduleIds = schedules.map(s => s._id);

    // 2. Locate all bookings pointing to those schedules
    const bookings = await Booking.find({ trek_schedule_id: { $in: scheduleIds } })
      .populate("user_id", "name email")
      .populate({
         path: "trek_schedule_id",
         populate: { path: "trek_id", select: "trek_name cost location" }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/vendor
export const getVendorBookings = async (req, res) => {
  try {
    const rides = await mongoose.model("Ride").find({ vendor_id: req.user.id });
    const rideIds = rides.map(r => r._id);

    const bookings = await Booking.find({ ride_id: { $in: rideIds } })
      .populate("user_id", "name email")
      .populate("ride_id")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    // 1. Fetch booking
    const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.booking_status === "Cancelled") {
       return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // 2. Add seats back
    if (booking.trek_schedule_id) {
       const schedule = await mongoose.model("TrekSchedule").findById(booking.trek_schedule_id).populate("trek_id");
       if (schedule) {
          schedule.available_seats += booking.seats;
          await schedule.save();

          await Notification.create({
            user_id: schedule.guide_id,
            message: `A client cancelled their booking of ${booking.seats} seat(s) for your "${schedule.trek_id?.trek_name || 'Trek'}" on ${new Date(schedule.start_date).toLocaleDateString()}.`,
            type: "cancellation"
          });

          await Notification.create({
            user_id: req.user.id,
            message: `You cancelled your booking of ${booking.seats} seat(s) for the "${schedule.trek_id?.trek_name || 'Trek'}" on ${new Date(schedule.start_date).toLocaleDateString()}.`,
            type: "cancellation"
          });
       }
    } else if (booking.ride_id) {
        const ride = await mongoose.model("Ride").findById(booking.ride_id);
        if (ride) {
           ride.available_seats += booking.seats;
           
           // Remove these specific seats from booked_seats
           if (booking.seat_numbers && booking.seat_numbers.length > 0) {
              ride.booked_seats = ride.booked_seats.filter(s => !booking.seat_numbers.includes(s));
           }
           
           await ride.save();

          // Notification to vendor about cancellation
          await Notification.create({
            user_id: ride.vendor_id,
            message: `A user cancelled their booking of ${booking.seats} seat(s) on your ride: ${ride.ride_name}`,
            type: "cancellation"
          });

          await Notification.create({
            user_id: req.user.id,
            message: `You cancelled your booking of ${booking.seats} seat(s) on the ride: ${ride.ride_name}`,
            type: "cancellation"
          });
       }
    }

    // 3. Mark booking as cancelled
    booking.booking_status = "Cancelled";
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.booking_status = status;
    await booking.save();

    // Create notification for the trekker
    await Notification.create({
      user_id: booking.user_id,
      message: `Your booking status for ${booking.trek_schedule_id ? "trek" : "ride"} has been updated to "${status}".`,
      type: "status_update"
    });

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
