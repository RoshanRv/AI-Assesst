import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Score from "@/model/score.model";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { assessment_id: string } }
) {
  try {
    await connectDB();
    const { assessment_id } = params;

    if (!assessment_id) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    const scores = await Score.find({
      assessment: new mongoose.Types.ObjectId(assessment_id),
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ scores }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
