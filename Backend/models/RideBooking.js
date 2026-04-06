import mongoose from "mongoose";

const rideBookingSchema = new mongoose.Schema({
  ride_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
  trekker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seats_booked: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ["Confirmed", "Cancelled"], default: "Confirmed" }
}, { timestamps: true });

export default mongoose.model("RideBooking", rideBookingSchema);
