import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  trekker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trekker",
    required: true
  },
  guide_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide"
  },
  trek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trek"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
