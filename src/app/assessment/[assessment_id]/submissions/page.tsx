"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

interface Submission {
  student: {
    name: string;
    email: string;
  };
  totalScore: number;
  percentage: { $numberDecimal: string };
}

export default function Submissions() {
  const { assessment_id } = useParams();
  const assessment_title = useSearchParams().get("assessment_title");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`/api/submissions/${assessment_id}`);
        setSubmissions(res.data.scores);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assessment_id]);

  if (loading) {
    return <div className="text-center py-12">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-[calc(100vh-100px)] bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 underline decoration-sky-300 decoration-4 underline-offset-8">
          {`${assessment_title} - Submissions`}
        </h1>
        {submissions.length > 0 ? (
          <table className="w-full bg-white shadow-sm rounded-md overflow-hidden">
            <thead className="bg-violet-300">
              <tr>
                <th className="text-left p-4 font-medium">Student Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Score</th>
                <th className="text-left p-4 font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index} className="border-b border-neutral-200">
                  <td className="p-4 capitalize">{submission.student.name}</td>
                  <td className="p-4">{submission.student.email}</td>
                  <td className="p-4">{submission.totalScore}</td>
                  <td className="p-4">
                    {submission.percentage.$numberDecimal}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-2xl capitalize font-medium py-12">
            No submissions found.
          </div>
        )}
      </div>
    </main>
  );
}
