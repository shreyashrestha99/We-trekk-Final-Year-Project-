import mongoose from "mongoose";

const trekkerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trekker_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Trekker", trekkerSchema);