import express from "express";
import { getSchedules, createSchedule, updateSeats } from "../controller/scheduleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSchedules)
  .post(protect, authorize("LocalVendor"), createSchedule);

router.route("/:id/seats")
  .put(protect, authorize("LocalVendor", "Admin"), updateSeats);

export default router;
