import express from "express";
import authenticate from "../middleware/authenticate.js";
import { clues } from "../data/clues.js";
import User from "../models/User.js";

const router = express.Router();

// 1. Drop the clues when the frontend timer hits zero
router.get("/clues", authenticate, (req, res) => {
  // Everyone gets the exact same array
  res.status(200).json({ success: true, clues });
});

// 2. Lock in the final dashed string
router.post("/submit", authenticate, async (req, res) => {
  try {
    const { finalAnswer } = req.body; // Expecting "11-apple-blue"

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

    res.status(200).json({ success: true, message: "Final answer locked in." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
