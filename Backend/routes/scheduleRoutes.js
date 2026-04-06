import express from "express";
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getGuideSchedules } from "../controller/scheduleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/guide", protect, authorize("Guide"), getGuideSchedules);

router.route("/")
  .get(getSchedules)
  .post(protect, authorize("Guide"), createSchedule);

router.route("/:id")
  .put(protect, authorize("Guide"), updateSchedule)
  .delete(protect, authorize("Guide"), deleteSchedule);

export default router;
