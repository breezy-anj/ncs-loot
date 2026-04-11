import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Resetting all operative progress...");

    const result = await User.updateMany(
      {},
      {
        $set: { currentLevel: 0 },
        $unset: { lastSolveTime: 1, completedAt: 1 },
      },
    );

    console.log(
      `SUCCESS: Reverted ${result.modifiedCount} operatives to Level 0.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Reset failed:", error);
    process.exit(1);
  }
};

reset();
