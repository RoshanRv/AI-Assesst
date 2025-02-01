import mongoose from "mongoose";
import Assessment from "./assessment.model";
import Student from "./student.model";

const scoreSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Assessment.modelName,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student.modelName,
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

// Create a compound index to ensure a student can only have one score per assessment
scoreSchema.index({ assessment: 1, student: 1 }, { unique: true });

const Score = mongoose.models.score || mongoose.model("score", scoreSchema);

export default Score;
