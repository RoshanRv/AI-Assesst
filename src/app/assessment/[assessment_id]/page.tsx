"use client";
import AssessmentForm from "@/components/AssessmentForm";
import useUser from "@/store/useUser";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  params: Promise<{ assessment_id: string }>;
};

const page = ({ params }: Props) => {
  const title = useSearchParams().get("assessment_title");
  const [assessment, setAssessment] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { currentUser } = useUser();

  useEffect(() => {
    async function fetchAssessment() {
      const res = await axios.get(
        `/api/assessment/${(await params).assessment_id}`
      );
      setAssessment(res.data.assessments[0].questions);
      setLoading(false);
    }
    fetchAssessment();
  }, []);

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
        const assessment_id = (await params).assessment_id;
        const res = await axios.put(`/api/assessment`, {
          id: assessment_id,
          questions: assessment,
        });
        toast.success(res.data.message);
      } else {
        // TODO: Save Students Score
        if (isAllOptionSelected()) {
          const score = calculateScore();
          const percentage = (score / assessment.length) * 100;
          const res = await axios.post(
            `/api/assessment/${(await params).assessment_id}`,
            {
              assessmentId: (await params).assessment_id,
              studentId: currentUser?._id,
              score,
              percentage,
            }
          );

          toast.success(res.data.message);
          router.back();
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
          </section>
        )}
      </div>
    </main>
  );
};

export default page;
