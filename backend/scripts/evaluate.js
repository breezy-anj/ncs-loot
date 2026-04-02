import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MASTER_ANSWER = "11-apple-blue";
// this key is hardcoded. Must be changed later after dating clues and their answers. CHOWDKI

const evaluate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Evaluating Loot submissions...\n");

    const users = await User.find({});

    for (let user of users) {
      if (!user.submittedAnswer) {
        console.log(`Player: ${user.name} | Status: NO SUBMISSION`);
        continue;
      }

      const submitted = user.submittedAnswer.toLowerCase().trim();

      if (submitted === MASTER_ANSWER) {
        console.log(
          `Player: ${user.name} | Status: PASSED ✅ | Time: ${user.submissionTime}`,
        );
      } else {
        console.log(
          `Player: ${user.name} | Status: FAILED ❌ | Guessed: ${submitted}`,
        );
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

evaluate();
