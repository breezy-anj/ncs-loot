import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to Atlas. Initiating total wipe...");
  try {
    const result = await User.deleteMany({});
    console.log(
      `SUCCESS: ${result.deletedCount} operatives purged from the database.`,
    );
  } catch (err) {
    console.log("Error wiping database:", err);
  }
  process.exit(0);
});
