import express from "express";
import {
  initiatePayment,
  esewaSuccess,
  esewaFailure,
  getPaymentStatus
} from "../controller/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Initiate eSewa payment — requires logged-in user
router.post("/initiate", protect, initiatePayment);

// eSewa callback routes — called by eSewa directly (no auth token)
router.get("/esewa-success", esewaSuccess);
router.get("/esewa-failure", esewaFailure);

// Get payment status for a booking
router.get("/:bookingId", protect, getPaymentStatus);

export default router;