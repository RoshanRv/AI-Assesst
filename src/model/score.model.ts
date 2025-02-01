import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  assessmentId: {
    type: String,
    required: true,
    trim: true,
  },
  studentId: {
    type: String,
    trim: true,
    required: true,
  },

  totalScore: {
    type: Number,
    required: true,
  },
  percentage: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

scoreSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Score = mongoose.models.score || mongoose.model("score", scoreSchema);

export default Score;
