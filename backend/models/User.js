import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zealId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  year: { type: String, required: true },
  admissionNumber: { type: String, required: true },

  // Game Data
  firstLogin: { type: Date },
  currentLevel: { type: Number, default: 0 },
  lastSolveTime: { type: Date },
  completedAt: { type: Date },
});

export default mongoose.model("User", UserSchema, "operatives");
