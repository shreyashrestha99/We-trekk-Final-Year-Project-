import express from "express";
import { getSchedules, createSchedule, updateSeats, getGuideSchedules } from "../controller/scheduleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/guide", protect, authorize("Guide"), getGuideSchedules);

router.route("/")
  .get(getSchedules)
  .post(protect, authorize("Guide"), createSchedule);

router.route("/:id/seats")
  .put(protect, authorize("Guide", "Admin"), updateSeats);

export default router;
