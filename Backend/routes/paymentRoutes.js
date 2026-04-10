import express from "express";
import { verifyPayment, getPaymentStatus } from "../controller/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify", protect, verifyPayment);
router.get("/:bookingId", protect, getPaymentStatus);

export default router;
