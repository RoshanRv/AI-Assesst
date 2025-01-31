import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  //   teacher: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Teacher",
  //     required: true
  //   },
  //   students: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Student"
  //   }],
  assessments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assessments",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Course =
  mongoose.models.courses || mongoose.model("courses", courseSchema);

export default Course;
