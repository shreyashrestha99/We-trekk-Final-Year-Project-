import express from "express";
import { getTreks, getTrekById, createTrek, updateTrek, deleteTrek } from "../controller/trekController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getTreks)
  .post(protect, authorize("LocalVendor"), createTrek);

router.route("/:id")
  .get(getTrekById)
  .put(protect, authorize("LocalVendor"), updateTrek)
  .delete(protect, authorize("Admin"), deleteTrek);

export default router;
