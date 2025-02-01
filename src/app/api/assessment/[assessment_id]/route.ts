import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Assessment from "@/model/assessment.model";
import Score from "@/model/score.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { assessment_id: string } }
) {
  try {
    const { assessment_id } = await params;
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

    console.log(assessmentId, studentId, score, percentage);

    if (
      !assessmentId ||
      !studentId ||
      score == undefined ||
      percentage == undefined
    ) {
      return NextResponse.json(
        {
          error: "Assessment ID, Student ID, Score and Percentage is required",
        },
        { status: 400 }
      );
    }

    const isScoreExist = await Score.find({ assessmentId, studentId });
    if (isScoreExist.length > 0) {
      await Score.findOneAndUpdate(
        { assessmentId, studentId },
        { score, percentage }
      );
    } else {
      await Score.create({
        assessmentId,
        studentId,
        totalScore: score,
        percentage,
      });
    }
    return NextResponse.json(
      { message: "Assessment created" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
