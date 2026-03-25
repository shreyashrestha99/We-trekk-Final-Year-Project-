import express from "express";
import { createPayment, getPaymentStatus } from "../controller/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("Trekker"), createPayment);
router.get("/:bookingId", protect, getPaymentStatus);

export default router;
