import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Ride from "../models/Ride.js";
import TrekSchedule from "../models/TrekSchedule.js";
import connectDB from "../config/db.js";

dotenv.config();

const clearShreyaBookings = async () => {
    try {
        await connectDB();

        // 1. Find Shreya
        const shreya = await User.findOne({ name: "Shreya Shrestha" });
        if (!shreya) {
            console.log("User Shreya Shrestha not found.");
            process.exit(1);
        }

        console.log(`Found User: ${shreya.name} (${shreya._id})`);

        // 2. Find all her bookings
        const bookings = await Booking.find({ user_id: shreya._id });
        console.log(`Found ${bookings.length} bookings for ${shreya.name}. Clearing...`);

        for (const booking of bookings) {
            // Restore seats to Ride if applicable
            if (booking.ride_id) {
                const ride = await Ride.findById(booking.ride_id);
                if (ride) {
                    ride.available_seats += booking.seats;
                    // Remove seat numbers from booked_seats array
                    if (booking.seat_numbers && booking.seat_numbers.length > 0) {
                        ride.booked_seats = ride.booked_seats.filter(s => !booking.seat_numbers.includes(s));
                    }
                    await ride.save();
                }
            }
            
            // Restore seats to TrekSchedule if applicable
            if (booking.trek_schedule_id) {
                const schedule = await TrekSchedule.findById(booking.trek_schedule_id);
                if (schedule) {
                    schedule.available_seats += booking.seats;
                    await schedule.save();
                }
            }

            // Delete the booking
            await Booking.findByIdAndDelete(booking._id);
            console.log(`Deleted booking ${booking._id}`);
        }

        console.log("All previous bookings for Shreya Shrestha have been cleared and seats restored.");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing bookings:", error);
        process.exit(1);
    }
};

clearShreyaBookings();
