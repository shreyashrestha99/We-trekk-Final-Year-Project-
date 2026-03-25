import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrekSchedule",
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },
  group_name: {
    type: String,
    required: true
  },
  max_members: {
    type: Number,
    required: true
  },
  current_members: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Open", "Full", "Closed", "Completed"],
    default: "Open"
  },
  include_transport: {
    type: Boolean,
    default: false
  },
  include_guide: {
    type: Boolean,
    default: false
  },
  include_accommodation: {
    type: Boolean,
    default: false
  },
  meeting_point: {
    type: String,
    default: ""
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);
