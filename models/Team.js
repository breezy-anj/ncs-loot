import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  year: { type: Number, default: 1 },
  firstLogin: { type: Date },

  clueHuntOrder: [Number],
  clueHuntExpectedAnswer: { type: String },
  clueHuntResponse: { type: String },
  clueHuntSubmissionTime: { type: Date },
});

export default mongoose.model("Team", TeamSchema);
