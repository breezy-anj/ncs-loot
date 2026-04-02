import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to Atlas.");
  try {
    await mongoose.connection.db.dropCollection("users");
    console.log(
      "SUCCESS: 'users' collection dropped. The ghost index is dead.",
    );
  } catch (err) {
    console.log("Note: Collection already dropped or doesn't exist.");
  }
  process.exit(0);
});
