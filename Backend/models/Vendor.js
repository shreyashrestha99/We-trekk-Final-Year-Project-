import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  company_name: {
    type: String,
    required: true
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

export default mongoose.model("Vendor", vendorSchema);


