import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Assessment from "@/model/assessment.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const courseId = req.nextUrl.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const assessments = await Assessment.find({ course: courseId });
    return NextResponse.json({ assessments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, course, questions } = await req.json();

    if (!title || !course || !questions) {
      return NextResponse.json(
        {
          error: "Title, course and questions are required",
        },
        { status: 400 }
      );
    }

    const assessment = await Assessment.create({
      title,
      course,
      questions,
    });

    return NextResponse.json(
      { message: "Assessment created successfully", assessment },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, title, course, questions } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    if (title) assessment.title = title;
    if (course) assessment.course = course;
    if (questions) assessment.questions = questions;

    await assessment.save();

    return NextResponse.json(
      { message: "Assessment updated successfully", assessment },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
