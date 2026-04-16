import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
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
import rideRoutes from "./routes/rideRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

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
app.use("/api/rides", rideRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));