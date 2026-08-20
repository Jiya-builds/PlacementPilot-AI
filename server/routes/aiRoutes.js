import express from "express";

import {
  testAI,
  analyzeResume,
  getMyAnalysis,
  generateInterviewQuestions,
  evaluateAnswer,
  getInterviewHistory,
  calculateATSMatch,
} from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================
   TEST AI
   ============================================================ */

router.get(
  "/test",
  testAI
);

/* ============================================================
   RESUME ANALYSIS
   ============================================================ */

router.get(
  "/resume-analysis",
  authMiddleware,
  analyzeResume
);

/* ============================================================
   GET SAVED ANALYSIS
   ============================================================ */

router.get(
  "/my-analysis",
  authMiddleware,
  getMyAnalysis
);

/* ============================================================
   ATS MATCH
   ============================================================ */

router.post(
  "/ats-match",
  authMiddleware,
  calculateATSMatch
);

/* ============================================================
   INTERVIEW QUESTIONS
   ============================================================ */

router.get(
  "/generate-questions",
  authMiddleware,
  generateInterviewQuestions
);

/* ============================================================
   EVALUATE INTERVIEW ANSWER
   ============================================================ */

router.post(
  "/evaluate-answer",
  authMiddleware,
  evaluateAnswer
);

/* ============================================================
   INTERVIEW HISTORY
   ============================================================ */

router.get(
  "/interview-history",
  authMiddleware,
  getInterviewHistory
);

export default router;