import express from "express";
import { getGroups, createGroup, joinGroup, approveMember, getVendorGroups, getGuideGroupMembers } from "../controller/groupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getGroups)
  .post(protect, authorize("LocalVendor"), createGroup);

router.post("/:id/join", protect, authorize("Trekker"), joinGroup);
router.put("/:id/approve/:memberId", protect, authorize("LocalVendor", "Admin"), approveMember);

router.get("/vendor/my-groups", protect, authorize("LocalVendor"), getVendorGroups);
router.get("/guide/my-members", protect, authorize("Guide"), getGuideGroupMembers);

export default router;
