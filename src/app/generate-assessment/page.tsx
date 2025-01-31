"use client";

import AssessmentForm from "@/components/AssessmentForm";
import FileUpload from "@/components/FileUpload";
import Select from "@/components/Select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

export default function GenerateAssessment() {
  const [stage, setStage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [topic, setTopic] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [assessment, setAssessment] = useState<MCQQuestion[]>([]);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/course");
      setCourses(res.data.courses);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch courses");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  const loadDocument = async () => {
    if (!file || uploading) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/load_document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      setStage(1);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error);
    } finally {
      setUploading(false);
    }
  };

  const generateAssessment = async () => {
    if (stage === 0 || !topic || !noOfQuestions || generating) return;

    try {
      setGenerating(true);
      const res = await axios.post("/api/generate-assessment", {
        topic,
        noOfQuestions,
      });
      const assessment = res.data.data;
      if (assessment.length === 0) {
        toast.error("Please try again with a different topic");
      } else {
        setAssessment(assessment);
        toast.success(res.data.message);
        setStage(2);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error);
    } finally {
      setGenerating(false);
    }
  };

  const saveAssessment = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setStage(3);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error);
    } finally {
      setSaving(false);
    }
  };

  const publishAssessment = async () => {
    if (publishing) return;

    if (!title || !course) return;

    try {
      setPublishing(true);
      const res = await axios.post("/api/assessment", {
        title,
        course,
        questions: assessment,
      });
      toast.success(res.data.message);
      setStage(4);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.log(error.response.data.error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-90px)] p-8 mb-20 bg-neutral-50">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-semibold mb-8 text-black underline underline-offset-8 decoration-4 decoration-sky-400">
          Generate Assessment
        </h1>
        {/* ############################################ */}
        {/* ############################################ */}
        {/* ############## STAGE 0 #################### */}
        {/* ############################################ */}
        {/* ############################################ */}
        {/* ### Upload PDF ### */}
        <section className="flex flex-col gap-4">
          <Heading number={1} title="Upload PDF" />
          <FileUpload
            file={file}
            setFile={setFile}
            uploadDocument={loadDocument}
            uploading={uploading}
            uploaded={stage > 0}
          />
        </section>
        {/* ############################################ */}
        {/* ############################################ */}
        {/* ############## STAGE 1 #################### */}
        {/* ############################################ */}
        {/* ############################################ */}
        <section className="flex flex-col gap-4">
          <Heading number={2} title="Generate Assessment" />
          <div
            className={`flex flex-col gap-4  border-sky-300 bg-white rounded-xl  ${
              stage === 0
                ? "h-0 overflow-hidden"
                : stage === 1
                ? "h-max p-6 border-4"
                : "h-max p-6 border-4 opacity-50"
            }`}
          >
            {/* ### Topic ### */}
            <div className="flex flex-col gap-2">
              <p className="text-black font-medium text-2xl">Topic</p>
              <TextareaAutosize
                readOnly={stage !== 1}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full outline-0 text-lg resize-none p-3 bg-neutral-200 rounded-md read-only:cursor-default"
                placeholder="Enter the topic of the assessment"
              />
            </div>
            {/* ### No. Of Questions ### */}
            <div className="flex flex-col gap-2">
              <p className="text-black font-medium text-2xl">
                No. of Questions
              </p>
              <input
                readOnly={stage !== 1}
                value={noOfQuestions}
                onChange={(e) => setNoOfQuestions(Number(e.target.value))}
                min={2}
                max={20}
                type="number"
                className="w-full outline-0 text-lg resize-none p-3 bg-neutral-200 rounded-md read-only:cursor-default"
                placeholder="Enter the number of questions"
              />
            </div>
            {/* ### Generate Button ### */}
            {stage === 1 && (
              <button
                onClick={generateAssessment}
                disabled={!topic || !noOfQuestions || generating}
                className={`px-10 py-3 text-lg rounded-md font-medium text-black ${
                  !topic || !noOfQuestions || generating
                    ? "bg-violet-300 opacity-50 cursor-not-allowed"
                    : "bg-violet-300 hover:bg-violet-200 hover:text-black/70 transition-all duration-300"
                }`}
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            )}
          </div>
        </section>
        {/* ############################################ */}
        {/* ############################################ */}
        {/* ############## STAGE 2 #################### */}
        {/* ############################################ */}
        {/* ############################################ */}
        <section className="flex flex-col gap-10">
          <Heading number={3} title="Verify Assessment" />
          <AssessmentForm
            assessment={assessment}
            setAssessment={setAssessment}
            completed={stage > 2}
          />
          {stage === 2 && (
            <button
              disabled={saving}
              onClick={saveAssessment}
              className={`py-3 text-lg rounded-md font-medium text-black bg-violet-300 ${
                saving
                  ? "bg-violet-200 opacity-50 cursor-not-allowed"
                  : "hover:bg-violet-200 hover:text-black/70 transition-all duration-300"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </section>
        {/* ############################################ */}
        {/* ############################################ */}
        {/* ############## STAGE 3 #################### */}
        {/* ############################################ */}
        {/* ############################################ */}
        <section className="flex flex-col gap-10">
          <Heading number={4} title="Publish Assessment" />
          <div
            className={`
          flex flex-col gap-4  border-sky-300 bg-white rounded-xl  ${
            stage < 3
              ? "h-0 overflow-hidden"
              : stage === 3
              ? "h-max p-6 border-4"
              : "h-max p-6 border-4 opacity-50"
          }
            `}
          >
            {/* ### Title ### */}
            <div className="flex flex-col gap-2">
              <p className="text-black font-medium text-2xl">Title</p>
              <TextareaAutosize
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full outline-0 text-lg resize-none p-3 bg-neutral-200 rounded-md read-only:cursor-default"
                placeholder="Enter the title"
              />
            </div>
            {/* ### Course ### */}
            <div className="flex flex-col gap-2">
              <p className="text-black font-medium text-2xl">Course</p>
              <Select
                value={course}
                onChange={(value) => setCourse(value)}
                options={courses}
                getLabel={(course) => course?.title || ""}
                getId={(course) => course?._id || ""}
                placeholder="Select a course"
              />
            </div>
            {/* ### Publish Button ### */}
            {stage === 3 && (
              <button
                disabled={publishing}
                onClick={publishAssessment}
                className="py-3 text-lg rounded-md font-medium text-black bg-violet-300 hover:bg-violet-200 hover:text-black/70 transition-all duration-300"
              >
                {publishing ? "Publishing..." : "Publish"}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

const Heading = ({ number, title }: { number: number; title: string }) => {
  return (
    <div className="flex gap-2 items-end text-black">
      <p className="text-4xl font-bold p-4 rounded-md bg-pink-300 w-16 text-center ">
        {number}.
      </p>
      <p className="text-2xl font-semibold p-3 px-6 w-full bg-violet-300 rounded-md ">
        {title}
      </p>
    </div>
  );
};
