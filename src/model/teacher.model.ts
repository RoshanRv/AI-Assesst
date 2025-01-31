import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
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
    // courses: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "courses"
    // }],
    // assessments: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "assessments"
    // }]
  },
  {
    timestamps: true,
  }
);

const Teacher =
  mongoose.models.teachers || mongoose.model("teachers", teacherSchema);

export default Teacher;
