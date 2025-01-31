"use client";
import AssessmentForm from "@/components/AssessmentForm";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  params: Promise<{ assessment_id: string }>;
};

const page = ({ params }: Props) => {
  const [assessment, setAssessment] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-[calc(100vh-90px)] bg-neutral-50">
      <div className=" max-w-6xl mx-auto px-6 py-8">
        {loading && assessment.length == 0 ? (
          <p>Loading...</p>
        ) : (
          <section className="flex flex-col gap-10">
            <AssessmentForm
              assessment={assessment}
              setAssessment={setAssessment}
              completed={false}
            />
            <button className="bg-violet-300 py-2 hover:bg-violet-200 hover:text-black/70 h-full transition-all duration-300 text-black font-medium text-lg rounded-md px-2">
              submit
            </button>
          </section>
        )}
      </div>
    </main>
  );
};

export default page;
