import express from "express";
import { 
  startInterview, 
  completeInterview,
  getInterview,
  getUserInterviews,
  healthCheck 
} from "../controllers/interview.controller.js";
import { validateInterviewRequest } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.get("/health", healthCheck);
router.post("/start-interview", authenticate, validateInterviewRequest, startInterview);
router.post("/complete", authenticate, completeInterview);
router.get("/:interviewId", getInterview);
router.get("/user/history", authenticate, getUserInterviews);
export default router;
