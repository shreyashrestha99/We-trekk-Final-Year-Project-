import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  trekker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trekker",
    required: true
  },
  needs_transport: {
    type: Boolean,
    default: false
  },
  needs_accommodation: {
    type: Boolean,
    default: false
  },
  needs_guide: {
    type: Boolean,
    default: false
  },
  joined_status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });

export default mongoose.model("GroupMember", groupMemberSchema);
