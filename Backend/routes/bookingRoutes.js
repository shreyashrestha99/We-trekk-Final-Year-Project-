import express from "express";
import { createBooking, getMyBookings, cancelBooking } from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, authorize("Trekker"), createBooking);

router.get("/my", protect, authorize("Trekker"), getMyBookings);
router.put("/:id/cancel", protect, authorize("Trekker", "Admin"), cancelBooking);

export default router;
