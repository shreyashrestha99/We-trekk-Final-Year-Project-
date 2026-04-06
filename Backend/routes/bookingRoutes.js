import express from "express";
import { createBooking, getMyBookings, cancelBooking, getVendorBookings, bookRide, getGuideBookings } from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Trek bookings
router.route("/")
  .post(protect, authorize("Trekker"), createBooking);

// Ride bookings
router.post("/ride/:rideId", protect, authorize("Trekker"), bookRide);

router.get("/my", protect, authorize("Trekker"), getMyBookings);
router.get("/vendor/my-bookings", protect, authorize("LocalVendor"), getVendorBookings);
router.get("/guide", protect, authorize("Guide"), getGuideBookings);
router.put("/:id/cancel", protect, authorize("Trekker", "Admin"), cancelBooking);

export default router;
