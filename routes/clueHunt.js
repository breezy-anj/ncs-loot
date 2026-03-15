import express from "express";
import authenticate from "../middleware/authenticate.js";
import { clues } from "../data/clueHuntClues.js";
import User from "../models/User.js";
import Team from "../models/Team.js";

const router = express.Router();

router.get("/assigned-clues", authenticate, async (req, res) => {
  try {
    const email = req.user.email;

    let user = await User.findOne({ email: email });
    if (!user) user = await User.findOne({ mobile: email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const team = await Team.findById(user.team);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    if (!team.clueHuntOrder || team.clueHuntOrder.length === 0) {
      return res.status(403).json({
        success: false,
        message: "The hunt hasn't started yet or your clues aren't assigned.",
      });
    }

    const assignedClues = team.clueHuntOrder.map((index) => ({
      clue: clues[index].question,
    }));

    res.status(200).json({ success: true, assignedClues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/submit", authenticate, async (req, res) => {
  try {
    const { answerString } = req.body;
    const email = req.user.email;

    if (!answerString) {
      return res
        .status(400)
        .json({ success: false, message: "No answers provided." });
    }

    let user = await User.findOne({ email: email });
    if (!user) user = await User.findOne({ mobile: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const team = await Team.findById(user.team);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    team.clueHuntResponse = answerString;
    team.clueHuntSubmissionTime = Date.now();

    await team.save();

    res.status(200).json({ success: true, message: "Hunt answers locked in." });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
export default router;
