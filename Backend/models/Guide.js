import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  experience_years: {
    type: Number,
    default: 0
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  license_no: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Guide", guideSchema);