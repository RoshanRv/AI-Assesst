import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Assessment from "@/model/assessment.model";
import Score from "@/model/score.model";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { assessment_id: string } }
) {
  try {
    const { assessment_id } = params;
    await connectDB();

    if (!assessment_id) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    const assessments = await Assessment.find({ _id: assessment_id });
    return NextResponse.json({ assessments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { assessmentId, studentId, score, percentage } = await req.json();

    if (
      !assessmentId ||
      !studentId ||
      score === undefined ||
      percentage === undefined
    ) {
      return NextResponse.json(
        {
          error: "Assessment ID, Student ID, Score and Percentage is required",
        },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectIds - Fixed constructor
    const assessmentObjectId = new mongoose.Types.ObjectId(assessmentId);
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Using findOneAndUpdate with upsert option
    await Score.findOneAndUpdate(
      {
        assessment: assessmentObjectId,
        student: studentObjectId,
      },
      {
        assessment: assessmentObjectId,
        student: studentObjectId,
        totalScore: score,
        percentage: percentage,
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated document
      }
    );

    return NextResponse.json(
      { message: "Assessment Submitted Successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Score already exists for this student and assessment" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
