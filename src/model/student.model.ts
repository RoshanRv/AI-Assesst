import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // enrolledCourses: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Course"
    // }],
    // completedAssessments: [{
    //   assessment: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Assessment"
    //   },
    //   score: Number,
    //   completedAt: Date
    // }]
  },
  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.students || mongoose.model("students", studentSchema);

export default Student;
