"use client";
import AssessmentForm from "@/components/AssessmentForm";
import useUser from "@/store/useUser";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const title = useSearchParams().get("assessment_title");
  const [assessment, setAssessment] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { currentUser } = useUser();
  const { assessment_id } = useParams();
  const [score, setScore] = useState<{
    totalScore: number;
    percentage: { $numberDecimal: string };
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  async function fetchAssessment() {
    try {
      const res = await axios.get(`/api/assessment/${assessment_id}`);
      setAssessment(res.data.assessments[0].questions);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  }

  async function fetchScore() {
    try {
      const res = await axios.get(
        `/api/score?assessmentId=${assessment_id}&studentId=${currentUser?._id}`
      );
      const score = res.data.score;
      if (score) {
        setScore(score);
        setShowResult(true);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssessment();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "student") {
      fetchScore();
    }
  }, [currentUser]);

  // calculate score
  const calculateScore = () => {
    let score = 0;
    assessment.forEach((question) => {
      if (question.selectedAnswer === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const isAllOptionSelected = () => {
    let isFilled = true;
    assessment.forEach((question) => {
      if (question.selectedAnswer === undefined) {
        isFilled = false;
      }
    });
    return isFilled;
  };

  // Save Assessment
  const saveAssessment = async () => {
    if (saving) return;

    try {
      setSaving(true);
      // Teacher can Update Assessment
      if (currentUser?.role === "teacher") {
        const res = await axios.put(`/api/assessment`, {
          id: assessment_id,
          questions: assessment,
        });
        toast.success(res.data.message);
        router.back();
      } else {
        // TODO: Save Students Score
        if (isAllOptionSelected()) {
          const score = calculateScore();
          const percentage = (score / assessment.length) * 100;
          const res = await axios.post(`/api/assessment/${assessment_id}`, {
            assessmentId: assessment_id,
            studentId: currentUser?._id,
            score,
            percentage,
          });

          toast.success(res.data.message);
          setScore({
            totalScore: score,
            percentage: { $numberDecimal: `${percentage}` },
          });
          setShowResult(true);
        } else {
          toast.error("Please select all the options");
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-90px)] bg-neutral-50">
      <div className=" max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-semibold mb-8 text-black underline underline-offset-8 decoration-4 decoration-sky-400">
          {title}
        </h1>
        {loading && assessment.length == 0 ? (
          <p>Loading...</p>
        ) : (
          <section className="flex flex-col gap-10">
            {/* Existing Score / Result */}
            {showResult && score ? (
              <div className="flex flex-col gap-4 bg-white p-6 rounded-lg border-4 border-sky-300">
                <h2 className="text-2xl font-bold text-black">Your Results</h2>
                <div className="flex flex-col gap-2">
                  <p className="text-lg">
                    Score:{" "}
                    <span className="font-semibold">{score.totalScore}</span>{" "}
                    out of {assessment.length}
                  </p>
                  <p className="text-lg">
                    Percentage:{" "}
                    <span className="font-semibold">
                      {score.percentage.$numberDecimal}%
                    </span>
                  </p>
                </div>
                {Number(score.percentage.$numberDecimal) >= 70 ? (
                  <p className="text-emerald-500 font-medium text-lg">
                    Great job! You passed the assessment!
                  </p>
                ) : (
                  <p className="text-red-400 font-medium text-lg">
                    Keep practicing! You can do better next time.
                  </p>
                )}
                <button
                  onClick={() => {
                    setShowResult(false);
                  }}
                  className="bg-violet-300 py-2 hover:bg-violet-200 hover:text-black/70 transition-all duration-300 text-black font-medium text-lg rounded-md px-4 mt-2"
                >
                  Retake Assessment
                </button>
              </div>
            ) : (
              <>
                <AssessmentForm
                  assessment={assessment}
                  setAssessment={setAssessment}
                  completed={false}
                />
                <button
                  disabled={saving}
                  onClick={saveAssessment}
                  className="bg-violet-300 py-2 hover:bg-violet-200 disabled:bg-violet-200 disabled:text-black/70 h-full transition-all duration-300 text-black font-medium text-lg rounded-md px-2"
                >
                  {saving
                    ? "Saving..."
                    : currentUser?.role === "teacher"
                    ? "Save"
                    : "Submit"}
                </button>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default page;
