import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Team from "../models/Team.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, zealId, password, teamId } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newTeam = await Team.create({ teamId: teamId || "test_team_1" });

    const newUser = await User.create({
      name,
      email,
      zealId,
      password: hashedPassword,
      teamId: newTeam.teamId,
      team: newTeam._id,
    });

    res
      .status(201)
      .json({ success: true, message: "User and Team created safely." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (!user) user = await User.findOne({ mobile: email });

    if (!user) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const team = await Team.findById(user.team);
    if (team && !team.firstLogin) {
      team.firstLogin = Date.now();
      await team.save();
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
    );

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
