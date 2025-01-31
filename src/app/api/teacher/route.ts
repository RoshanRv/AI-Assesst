import { NextRequest, NextResponse } from "next/server";
import Teacher from "@/model/teacher.model";
import connectDB from "@/utils/db";

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find({});
    return NextResponse.json({ teachers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return NextResponse.json(
        { error: "Teacher already exists" },
        { status: 400 }
      );
    }

    // Create new teacher
    const teacher = await Teacher.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "Teacher created successfully", teacher },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
