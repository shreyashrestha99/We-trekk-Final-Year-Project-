import mongoose from "mongoose";

const trekItinerarySchema = new mongoose.Schema({
  trek_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trek",
    required: true
  },
  day_number: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("TrekItinerary", trekItinerarySchema);
