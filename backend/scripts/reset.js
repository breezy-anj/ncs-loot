import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Reverting evaluation state...");

    const result = await User.updateMany(
      {},
      { $set: { isEvaluated: false, correctClues: 0 } },
    );

    console.log(
      `SUCCESS: Reverted ${result.modifiedCount} operatives to pre-evaluation state.`,
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

reset();
