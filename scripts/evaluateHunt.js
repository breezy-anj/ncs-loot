import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../models/Team.js";
import User from "../models/User.js";

dotenv.config();

const evaluateHunt = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Evaluation...\n");

    const teams = await Team.find({}).populate("users");

    console.log("--- CLUE HUNT RESULTS ---");

    for (let team of teams) {
      if (!team.clueHuntResponse) {
        console.log(
          `Team: ${team.teamId} | Status: DISQUALIFIED (No submission)`,
        );
        continue;
      }

      const expected = (team.clueHuntExpectedAnswer || "").toLowerCase().trim();
      const submitted = (team.clueHuntResponse || "").toLowerCase().trim();

      if (expected === submitted) {
        console.log(
          `Team: ${team.teamId} | Status: PASSED ✅ | Time: ${team.clueHuntSubmissionTime}`,
        );
      } else {
        console.log(`Team: ${team.teamId} | Status: FAILED ❌`);
        console.log(`  Expected: ${expected}`);
        console.log(`  Got:      ${submitted}`);
      }
    }

    console.log("\nEvaluation Complete.");
    process.exit(0);
  } catch (error) {
    console.error("Evaluation error:", error);
    process.exit(1);
  }
};

evaluateHunt();
