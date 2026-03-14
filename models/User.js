import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String },
  zealId: { type: String, required: true },
  password: { type: String, required: true },
  year: { type: Number, default: 1, required: true },
  admissionNumber: { type: String, default: "2023" },
  teamId: { type: String },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team", //  links the User document to the Team document
  },
});

export default mongoose.model("User", UserSchema);
