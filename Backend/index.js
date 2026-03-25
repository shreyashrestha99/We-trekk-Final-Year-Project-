import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trekRoutes from "./routes/trekRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/treks", trekRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));