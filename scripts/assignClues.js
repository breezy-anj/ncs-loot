import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../models/Team.js";
import { clues } from "../data/clueHuntClues.js";

dotenv.config();

const getRandomIndices = (totalLength, numRequired) => {
  const indices = new Set();
  while (indices.size < numRequired) {
    indices.add(Math.floor(Math.random() * totalLength));
  }
  return Array.from(indices);
};

const assignCluesToTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const teams = await Team.find({});
    if (teams.length === 0) {
      console.log("No teams found. You need to register some users first.");
      process.exit(0);
    }

    for (let team of teams) {
      const randomIndices = getRandomIndices(clues.length, 5);

      const expectedAnswerString = randomIndices
        .map((index) => clues[index].answer)
        .join("");

      team.clueHuntOrder = randomIndices;
      team.clueHuntExpectedAnswer = expectedAnswerString;

      await team.save();
      console.log(`Assigned clues to team: ${team.teamId}`);
    }

    console.log("CRITICAL: All teams have their custom answer keys locked in.");
    process.exit(0);
  } catch (error) {
    console.error("Error assigning clues:", error);
    process.exit(1);
  }
};

assignCluesToTeams();
