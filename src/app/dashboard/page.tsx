"use client";

import useCourse from "@/store/useCourse";
import useUser from "@/store/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Dashboard() {
  const router = useRouter();
  const { currentUser } = useUser();
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
      <main className="min-h-[calc(100vh-90px)] bg-neutral-50">
        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Course Title */}
          <div className="flex items-baseline gap-4 mb-8 border-b-4 border-sky-300 pb-4">
            <h1 className="text-3xl font-bold text-black">
              {currentCourse?.title}
            </h1>

            {assessments.length > 0 && (
              <p className="text-black text-lg bg-pink-300 rounded-md px-2 py-1">
                <span className="text-2xl mr-1 font-semibold">
                  {assessments.length}
                </span>
                {assessments.length === 1 ? " Assessment" : " Assessments"}
              </p>
            )}
          </div>

          {/* Assessments Grid */}
          {loading ? (
            <div className="text-center py-12 text-black text-xl">
              Loading assessments...
            </div>
          ) : assessments.length > 0 ? (
            //   ## ASSESSMENTS ##
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <div
                  key={assessment._id}
                  onClick={() =>
                    router.push(
                      `/assessment/${assessment._id}?assessment_title=${assessment.title}`
                    )
                  }
                  className="p-6 bg-white border-2 cursor-pointer border-sky-300 rounded-md hover:border-violet-300 transition-all duration-200 hover:shadow-md"
                >
                  <h3 className="text-xl font-medium mb-3 text-black">
                    {assessment.title}
                  </h3>
                  <div className="flex items-center gap-3 justify-between">
                    <span className="px-3 py-1 bg-violet-300 rounded-md text-sm">
                      {assessment.questions.length} questions
                    </span>
                    {/* ## DATE ## */}
                    <p className="text-black text-sm">
                      {moment(assessment.createdAt).format("MMM DD, YYYY")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No assessments available
            <div className="text-center py-12 bg-white rounded-xl border-4 border-dashed border-sky-300">
              <p className="text-black text-xl capitalize">
                No assessments available for this course
              </p>
              {currentUser?.role === "teacher" && (
                <button
                  onClick={() => router.push("/generate-assessment")}
                  className="mt-4 px-4 py-3  bg-violet-300 rounded-md hover:bg-violet-200 hover:text-black/70 transition-colors"
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
