import express from "express";
import { getSchedules, createSchedule, updateSeats, getGuideSchedules } from "../controller/scheduleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSchedules)
  .post(protect, authorize("LocalVendor"), createSchedule);

router.route("/:id/seats")
  .put(protect, authorize("LocalVendor", "Admin"), updateSeats);

router.get("/guide/my-schedules", protect, authorize("Guide"), getGuideSchedules);

export default router;
