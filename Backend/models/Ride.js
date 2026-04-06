import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trek"
  },
  ride_name: { type: String, required: true, default: "Shared Ride" },
  pickup_location: { type: String, required: true, default: "TBD" },
  drop_location: { type: String, required: true },
  vehicle_type: { type: String, default: "Jeep" }, // kept for backward compatibility with older data if any
  departure_time: { type: Date, required: true },
  price: { type: Number, required: true },
  total_seats: { type: Number, required: true },
  available_seats: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Ride", rideSchema);
