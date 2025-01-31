import { NextRequest, NextResponse } from "next/server";
import Student from "@/model/student.model";
import connectDB from "@/utils/db";

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({});
    return NextResponse.json({ students }, { status: 200 });
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

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return NextResponse.json(
        { error: "Student already exists" },
        { status: 400 }
      );
    }

    // Create new student
    const student = await Student.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "Student created successfully", student },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
