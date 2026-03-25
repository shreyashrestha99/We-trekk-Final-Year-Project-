import express from "express";
import { getGroups, createGroup, joinGroup, approveMember } from "../controller/groupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getGroups)
  .post(protect, authorize("LocalVendor"), createGroup);

router.post("/:id/join", protect, authorize("Trekker"), joinGroup);
router.put("/:id/approve/:memberId", protect, authorize("LocalVendor", "Admin"), approveMember);

export default router;
