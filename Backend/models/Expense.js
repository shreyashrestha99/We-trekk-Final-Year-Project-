import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  trekker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trekker",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  expense_date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
