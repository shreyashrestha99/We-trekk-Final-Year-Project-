import mongoose from "mongoose";

const trekTransportSchema = new mongoose.Schema({
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrekSchedule",
    required: true
  },
  transport_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transport",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("TrekTransport", trekTransportSchema);
