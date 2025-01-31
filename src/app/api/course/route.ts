import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Course from "@/model/course.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const courses = await Course.find();
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const course = await Course.create({
      title,
      description,
    });

    return NextResponse.json(
      { message: "Course created successfully", course },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, title, description } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (title) course.title = title;
    if (description) course.description = description;

    await course.save();

    return NextResponse.json(
      { message: "Course updated successfully", course },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
