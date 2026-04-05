import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zealId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  year: { type: String, required: true },
  admissionNumber: { type: String, required: true },

  // Game Data
  firstLogin: { type: Date },
  submittedAnswer: { type: String },
  submissionTime: { type: Date },

  // Post-Evaluation Data
  isEvaluated: { type: Boolean, default: false },
  correctClues: { type: Number, default: 0 },
});

export default mongoose.model("User", UserSchema, "operatives");
