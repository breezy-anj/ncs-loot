import express from "express";
import authenticate from "../middleware/authenticate.js";
import { clues } from "../data/clues.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/clues", authenticate, (req, res) => {
  res.status(200).json({ success: true, clues });
});

router.post("/submit", authenticate, async (req, res) => {
  try {
    const isVaultLocked = await User.exists({ isEvaluated: true });
    if (isVaultLocked) {
      return res.status(403).json({
        success: false,
        message: "EVALUATION COMPLETE. VAULT IS LOCKED.",
      });
    }

    const { finalAnswer } = req.body;

    if (!finalAnswer) {
      return res
        .status(400)
        .json({ success: false, message: "Missing answer" });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.submittedAnswer = finalAnswer;
    user.submissionTime = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Answer recorded.",
      submittedAnswer: finalAnswer,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const evaluatedCount = await User.countDocuments({ isEvaluated: true });

    if (evaluatedCount === 0) {
      return res.status(200).json({ success: true, active: false });
    }

    const leaderboard = await User.find({
      isEvaluated: true,
      submittedAnswer: { $exists: true, $ne: null },
    })
      .select("name admissionNumber submissionTime correctClues")
      .sort({ correctClues: -1, submissionTime: 1 });

    res.status(200).json({ success: true, active: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
