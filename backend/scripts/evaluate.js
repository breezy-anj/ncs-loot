import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const MASTER_ANSWERS = ["11", "apple", "blue"];

const evaluate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Evaluating Loot submissions...\n");

    const users = await User.find({});
    let processed = 0;

    for (let user of users) {
      if (!user.submittedAnswer) continue;

      const userParts = user.submittedAnswer.toLowerCase().trim().split("-");
      let correctCount = 0;

      for (let i = 0; i < MASTER_ANSWERS.length; i++) {
        if (userParts[i] && userParts[i].trim() === MASTER_ANSWERS[i]) {
          correctCount++;
        }
      }

      user.correctClues = correctCount;
      user.isEvaluated = true;
      await user.save();

      console.log(
        `Operative: ${user.name} | Score: ${correctCount}/${MASTER_ANSWERS.length}`,
      );
      processed++;
    }

    console.log(`\nEvaluation complete. ${processed} operatives graded.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

evaluate();
