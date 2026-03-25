import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
  transport_type: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Transport", transportSchema);
