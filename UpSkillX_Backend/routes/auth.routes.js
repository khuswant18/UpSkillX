import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import prisma from "../db/config.js";
const router = express.Router();
router.post("/signup", register);
router.post("/register", register); // Add this for frontend compatibility
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        experience: true,
        skills: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
    });
  }
});
export default router;
