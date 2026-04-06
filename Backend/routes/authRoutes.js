import express from "express";
import { register, login, getProfile, updateProfile } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profile_image"), updateProfile);

export default router;
