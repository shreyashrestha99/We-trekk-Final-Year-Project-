import express from "express";
import { createReview, getTrekReviews, deleteReview } from "../controller/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("Trekker"), createReview);
router.get("/trek/:trekId", getTrekReviews); // public route
router.delete("/:id", protect, deleteReview);

export default router;
