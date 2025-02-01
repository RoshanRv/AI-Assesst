import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Assessment from "@/model/assessment.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { assessment_id: string } }
) {
  try {
    await connectDB();
    console.log(params.assessment_id);
    if (!params.assessment_id) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    const assessments = await Assessment.find({ _id: params.assessment_id });
    return NextResponse.json({ assessments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
