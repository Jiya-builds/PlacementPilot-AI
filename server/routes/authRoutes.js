import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

// Protected Route
router.get("/me", authMiddleware, getMe);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

export default router;