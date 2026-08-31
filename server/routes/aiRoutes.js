import express from "express";
import {
 testAI,
 analyzeResume,
 getMyAnalysis,
 generateInterviewQuestions,
 evaluateAnswer,
 getInterviewHistory
} from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test", testAI);
router.get("/resume-analysis", authMiddleware, analyzeResume);
router.get(
  "/my-analysis",
  authMiddleware,
  getMyAnalysis
);
router.get(
 "/generate-questions",
 authMiddleware,
 generateInterviewQuestions
);

router.post(
 "/evaluate-answer",
 authMiddleware,
 evaluateAnswer
);

router.get(
 "/interview-history",
 authMiddleware,
 getInterviewHistory
);
export default router;