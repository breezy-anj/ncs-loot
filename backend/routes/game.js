import express from "express";
import authenticate from "../middleware/authenticate.js";
import { clues } from "../data/clues.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/current", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const level = user.currentLevel || 0;

    if (level >= clues.length) {
      return res.status(200).json({ success: true, completed: true });
    }

    res.status(200).json({
      success: true,
      completed: false,
      clue: { id: clues[level].id, text: clues[level].text },
      level: level,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/verify", authenticate, async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer)
      return res
        .status(400)
        .json({ success: false, message: "Missing answer" });

    const user = await User.findById(req.user.id);
    const level = user.currentLevel || 0;

    if (level >= clues.length) {
      return res
        .status(400)
        .json({ success: false, message: "Mission already completed." });
    }

    const cleanUserPart = answer.toLowerCase().replace(/\s+/g, "");

    if (cleanUserPart === clues[level].answer) {
      user.currentLevel = level + 1;
      user.lastSolveTime = Date.now();

      if (user.currentLevel === clues.length) {
        user.completedAt = Date.now();
      }

      await user.save();

      return res.status(200).json({
        success: true,
        correct: true,
        message: "ACCESS GRANTED. NEXT CLUE UNLOCKED.",
        level: user.currentLevel,
      });
    } else {
      return res.status(200).json({
        success: true,
        correct: false,
        message: "INCORRECT DECRYPTION. TRY AGAIN.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    // Only fetch users who have solved at least one clue
    const leaderboard = await User.find({ currentLevel: { $gt: 0 } })
      .select("name admissionNumber lastSolveTime currentLevel")
      .sort({ currentLevel: -1, lastSolveTime: 1 });

    if (leaderboard.length === 0) {
      return res.status(200).json({ success: true, active: false });
    }

    res.status(200).json({ success: true, active: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
