import mongoose from "mongoose";

const trekScheduleSchema = new mongoose.Schema({
  trek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trek",
    required: true
  },
  guide_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  available_seats: {
    type: Number,
    required: true
  },
  total_seats: {          // ← ADD THIS
  type: Number,
  required: true
},
},
{ timestamps: true });

export default mongoose.model("TrekSchedule", trekScheduleSchema);
