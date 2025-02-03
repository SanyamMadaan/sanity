import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
  },
  team1: {
    type: String,
    required: false,
  },
  team2: {
    type: String,
    required: false,
  },
  winner: {
    type: String,
    default: "",
  },
});

const bracketSchema = new mongoose.Schema({
  tournament_name: {
    type: String,
    required: true,
    trim: true,
  },
  format: {
    type: String,
    enum: ["single_elimination", "double_elimination", "round_robin"],
    required: true,
  },
  consolationFinal: {
    type: Boolean,
    default: false,
  },
  grandFinalType: {
    type: String,
    enum: ["simple", "double"],
    required: true,
  },
  teams: {
    type: [String], // Array of team names
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length >= 4; // Ensure at least 4 teams
      },
      message: "Number of teams must be at least 4.",
    },
  },
  matches: {
    type: [matchSchema],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Bracket ||
  mongoose.model("Bracket", bracketSchema);
