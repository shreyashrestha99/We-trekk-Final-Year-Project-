import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    enum: ["esewa", "khalti", "cash", "card"],
    required: true
  },
  payment_status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
