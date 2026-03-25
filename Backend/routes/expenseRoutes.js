import express from "express";
import { createExpense, getMyExpenses, generateReport } from "../controller/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("Trekker"), createExpense);
router.get("/my", protect, authorize("Trekker"), getMyExpenses);
router.get("/report", protect, authorize("Trekker"), generateReport);

export default router;
