import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, zealId, password, year, admissionNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      zealId,
      password: hashedPassword,
      year,
      admissionNumber,
    });

    res.status(201).json({ success: true, message: "Operative created." });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Zeal ID already registered." });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { zealId, password } = req.body;
    const user = await User.findOne({ zealId });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Operative not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid access key." });

    if (!user.firstLogin) {
      user.firstLogin = Date.now();
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, zealId: user.zealId },
      process.env.JWT_SECRET,
    );

    const userData = {
      id: user._id,
      name: user.name,
      zealId: user.zealId,
      hasSubmitted: !!user.submittedAnswer,
      submittedAnswer: user.submittedAnswer || null,
    };

    res.status(200).json({ success: true, token, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        zealId: user.zealId,
        hasSubmitted: !!user.submittedAnswer,
        submittedAnswer: user.submittedAnswer || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
