import express from "express";
import { 
  getTreks, 
  getTrekById, 
  createTrek, 
  updateTrek, 
  deleteTrek,
  getGuideTreks,
  getGuideEarnings
} from "../controller/trekController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public / Base routes
router.route("/")
  .get(getTreks)
  .post(protect, authorize("Guide"), upload.single("image"), createTrek);

// Guide specific functional routes
router.get("/guide", protect, authorize("Guide"), getGuideTreks);
router.get("/earnings", protect, authorize("Guide"), getGuideEarnings);

// ID-based routes MUST go last
router.route("/:id")
  .get(getTrekById)
  .put(protect, authorize("Guide"), updateTrek)
  .delete(protect, authorize("Guide", "Admin"), deleteTrek);

export default router;
