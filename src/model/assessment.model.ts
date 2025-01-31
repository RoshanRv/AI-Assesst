import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: String,
    trim: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswer: {
        type: String,
        required: true,
      },
    },
  ],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
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

assessmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Assessment =
  mongoose.models.assessments ||
  mongoose.model("assessments", assessmentSchema);

export default Assessment;
