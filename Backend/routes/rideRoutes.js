import express from "express";
import { createRide, getRides, getVendorRides, getVendorEarnings, updateRide, deleteRide } from "../controller/rideController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getRides);
router.post("/", protect, authorize("LocalVendor"), createRide);
router.get("/vendor", protect, authorize("LocalVendor"), getVendorRides);
router.get("/earnings", protect, authorize("LocalVendor"), getVendorEarnings);
router.put("/:id", protect, authorize("LocalVendor"), updateRide);
router.delete("/:id", protect, authorize("LocalVendor"), deleteRide);

export default router;
