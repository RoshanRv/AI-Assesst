"use client";

import { useEffect, useState } from "react";
import useUser from "@/store/useUser";
import useCourse from "@/store/useCourse";
import axios from "axios";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { currentUser, setTeacherAndStudent, switchUser } = useUser();
  const { currentCourse } = useCourse();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch assessments when course changes
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!currentCourse) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `/api/assessment?courseId=${currentCourse._id}`
        );
        setAssessments(res.data.assessments);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [currentCourse]);

  return (
    <>
      <main className="min-h-screen bg-neutral-50">
        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Course Title */}
          <div className="flex items-baseline gap-4 mb-8">
            <h1 className="text-3xl font-bold text-black">
              {currentCourse?.title}
            </h1>
            <p className="text-black/60">
              {assessments.length}{" "}
              {assessments.length === 1 ? "assessment" : "assessments"}
            </p>
          </div>

          {/* Assessments Grid */}
          {loading ? (
            <div className="text-center py-12 text-black/60">
              Loading assessments...
            </div>
          ) : assessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="p-6 bg-white border-2 border-sky-300 rounded-xl hover:border-violet-300 transition-all duration-200 hover:shadow-md"
                >
                  <h3 className="text-xl font-medium mb-3 text-black">
                    {assessment.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                      {assessment.questions.length} questions
                    </span>
                    {currentUser?.role === "student" && (
                      <button className="px-3 py-1 bg-violet-300 rounded-full text-sm font-medium hover:bg-violet-200 transition-colors">
                        Take Assessment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-neutral-200">
              <p className="text-black/60">
                No assessments available for this course
              </p>
              {currentUser?.role === "teacher" && (
                <button
                  onClick={() => router.push("/generate-assessment")}
                  className="mt-4 px-4 py-2 bg-violet-300 rounded-lg hover:bg-violet-200 transition-colors text-sm"
                >
                  Create First Assessment
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
