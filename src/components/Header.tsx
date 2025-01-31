"use client";

import useUser from "@/store/useUser";
import useCourse from "@/store/useCourse";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { PiUserSwitch } from "react-icons/pi";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, setTeacherAndStudent, switchUser } = useUser();
  const { courses, currentCourse, setCourses, setCurrentCourse } = useCourse();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch all initial data in parallel
        const [coursesRes, teacherRes, studentRes] = await Promise.all([
          axios.get("/api/course"),
          axios.get("/api/teacher"),
          axios.get("/api/student"),
        ]);

        // Set courses in store
        setCourses(coursesRes.data.courses);

        // Set users in store
        const teacher = teacherRes.data.teachers.at(0);
        const student = studentRes.data.students.at(0);

        setTeacherAndStudent(
          teacher ? { ...teacher, role: "teacher" } : null,
          student ? { ...student, role: "student" } : null
        );
        switchUser("teacher");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (loading) {
    return (
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="animate-pulse flex justify-between items-center">
            <div className="h-8 w-32 bg-neutral-200 rounded" />
            <div className="h-8 w-48 bg-neutral-200 rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-pink-300 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-black">Ai</span>
          </div>
          <h1 className="text-xl font-semibold text-black">AI-ASSESST</h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-sky-300 rounded-lg flex items-center justify-center">
                <p className="text-2xl font-semibold text-black capitalize">
                  {currentUser?.name.charAt(0)}
                </p>
              </div>
              {/* ## NAME & ROLE ## */}
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-black capitalize">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-neutral-500 text-left  rounded-md capitalize">
                  {currentUser?.role}
                </p>
              </div>
              <IoChevronDown className="w-4 h-4 text-neutral-500" />
            </button>

            {/* ## DROPDOWN MENU ## */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-300 overflow-hidden py-3">
                {/* Course List */}
                <div className="px-4">
                  <p className="text-lg font-medium text-black border-b-2 border-sky-300">
                    Courses
                  </p>
                  <div className="max-h-64 overflow-y-auto py-2 gap-1 flex flex-col">
                    {courses.map((course) => (
                      <button
                        key={course._id}
                        onClick={() => {
                          setCurrentCourse(course);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-md ${
                          currentCourse?._id === course._id
                            ? "bg-violet-300 "
                            : "hover:bg-violet-100"
                        }`}
                      >
                        {course.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Switch User Option */}
                <div className="px-4 ">
                  <button
                    onClick={() => {
                      switchUser(
                        currentUser?.role === "teacher" ? "student" : "teacher"
                      );
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left bg-pink-200 hover:bg-pink-300 px-4 py-2.5 rounded-md flex items-center gap-2 text-black/70 hover:text-black"
                  >
                    <PiUserSwitch size={20} />
                    <span>
                      {currentUser?.role === "teacher" ? "Student" : "Teacher"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Assessment Button */}
          {currentUser?.role === "teacher" && pathname === "/dashboard" && (
            <button
              onClick={() => router.push("/generate-assessment")}
              className="px-6 py-2.5 bg-violet-300 rounded-md hover:bg-violet-200 hover:text-black/60 text-black transition-colors"
            >
              Create Assessment
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
