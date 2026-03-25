import mongoose from "mongoose";

const trekSchema = new mongoose.Schema({
  trek_name: {
    type: String,
    required: true
  },
  difficulty_level: {
    type: String,
    enum: ["Easy", "Moderate", "Hard", "Extreme"],
    required: true
  },
  duration_days: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  max_group_size: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Trek", trekSchema);
