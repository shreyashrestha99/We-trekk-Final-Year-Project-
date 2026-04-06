import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trek_schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrekSchedule"
  },
  ride_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride"
  },
  seats: {
    type: Number,
    required: true,
    default: 1
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  booking_status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending"
  },
  dispute_status: {
    type: String,
    enum: ["None", "Raised", "Resolved"],
    default: "None"
  },
  dispute_reason: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
