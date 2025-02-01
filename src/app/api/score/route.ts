import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Score from "@/model/score.model";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const assessmentId = req.nextUrl.searchParams.get("assessmentId");
    const studentId = req.nextUrl.searchParams.get("studentId");

    // Require both IDs
    if (!assessmentId || !studentId) {
      return NextResponse.json(
        { error: "Both Assessment ID and Student ID are required" },
        { status: 400 }
      );
    }

    const score = await Score.findOne({
      assessment: new mongoose.Types.ObjectId(assessmentId),
      student: new mongoose.Types.ObjectId(studentId),
    })
      .populate("assessment")
      .populate("student")
      .sort({ createdAt: -1 });

    if (!score) {
      return NextResponse.json(
        {
          message: "No score found for this student and assessment",
          score: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ score }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
