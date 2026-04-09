import express from "express";
import { createBooking, getMyBookings, cancelBooking, getVendorBookings, bookRide, getGuideBookings, updateBookingStatus } from "../controller/bookingController.js";
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
router.route("/guide")
  .get(protect, authorize("Guide"), getGuideBookings);

router.route("/:id/cancel")
  .put(protect, authorize("Trekker", "Admin"), cancelBooking);

router.route("/:id/status")
  .put(protect, authorize("Trekker", "Guide", "LocalVendor", "Admin"), updateBookingStatus);

export default router;
