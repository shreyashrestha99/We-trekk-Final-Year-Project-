import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  trekker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trekker",
    required: true
  },
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrekSchedule",
    required: true
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
