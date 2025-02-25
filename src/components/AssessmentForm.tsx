"use client";

import useUser from "@/store/useUser";
import { FiTrash } from "react-icons/fi";
import { GrAdd, GrFormCheckmark, GrFormClose } from "react-icons/gr";
import TextareaAutosize from "react-textarea-autosize";

interface Props {
  assessment: MCQQuestion[];
  setAssessment: (assessment: MCQQuestion[]) => void;
  completed: boolean;
}

const AssessmentForm = ({ assessment, setAssessment, completed }: Props) => {
  const handleQuestionUpdate = (questionIndex: number, question: string) => {
    const newAssessment = [...assessment];
    newAssessment[questionIndex]["question"] = question;
    setAssessment(newAssessment);
  };

  const handleOptionUpdate = (
    questionIndex: number,
    optionIndex: number,
    option: string
  ) => {
    const newAssessment = [...assessment];
    newAssessment[questionIndex]["options"][optionIndex] = option;
    setAssessment(newAssessment);
  };

  const handleAnswerUpdate = (questionIndex: number, answer: string) => {
    const newAssessment = [...assessment];
    newAssessment[questionIndex]["correctAnswer"] = answer;
    setAssessment(newAssessment);
  };

  const handleDeleteQuestion = (questionIndex: number) => {
    const newAssessment = [...assessment];
    newAssessment.splice(questionIndex, 1);
    setAssessment(newAssessment);
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const newAssessment = [...assessment];
    newAssessment[questionIndex]["options"].splice(optionIndex, 1);
    setAssessment(newAssessment);
  };

  const handleAddOption = (questionIndex: number) => {
    const newAssessment = [...assessment];
    newAssessment[questionIndex]["options"].push("");
    setAssessment(newAssessment);
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    const newAssessment = [...assessment];
    newAssessment[questionIndex]["selectedAnswer"] = answer;
    setAssessment(newAssessment);
  };

  return (
    <>
      {assessment.map((question, index) => (
        <Question
          key={`${index}-${question._id || question.question}`}
          {...question}
          questionIndex={index}
          handleQuestionUpdate={handleQuestionUpdate}
          handleOptionUpdate={handleOptionUpdate}
          handleAnswerUpdate={handleAnswerUpdate}
          handleDeleteQuestion={handleDeleteQuestion}
          handleDeleteOption={handleDeleteOption}
          handleAddOption={handleAddOption}
          completed={completed}
          handleSelectAnswer={handleSelectAnswer}
        />
      ))}
    </>
  );
};

export default AssessmentForm;

interface QuestionProps extends MCQQuestion {
  questionIndex: number;
  handleQuestionUpdate: (questionIndex: number, question: string) => void;
  handleOptionUpdate: (
    questionIndex: number,
    optionIndex: number,
    option: string
  ) => void;
  handleAnswerUpdate: (questionIndex: number, answer: string) => void;
  handleDeleteQuestion: (questionIndex: number) => void;
  handleDeleteOption: (questionIndex: number, optionIndex: number) => void;
  handleAddOption: (questionIndex: number) => void;
  completed: boolean;
  handleSelectAnswer: (questionIndex: number, answer: string) => void;
}

const Question = ({
  question,
  options,
  correctAnswer,
  questionIndex,
  selectedAnswer,
  handleQuestionUpdate,
  handleOptionUpdate,
  handleAnswerUpdate,
  handleDeleteQuestion,
  handleDeleteOption,
  handleAddOption,
  completed,
  handleSelectAnswer,
}: QuestionProps) => {
  const { currentUser } = useUser();
  return (
    <div
      className={`flex flex-col gap-4 border-4 border-sky-300 p-4 rounded-lg bg-white ${
        completed && "opacity-50 cursor-not-allowed"
      }`}
    >
      {/* ### QUESTION ### */}
      <div className="flex flex-row gap-2 items-end justify-between">
        <div className="flex gap-2 items-end">
          <p className="text-black font-semibold text-2xl py-2 bg-pink-300 w-10 text-center rounded-md">
            {questionIndex + 1}.
          </p>
          <p className="text-black font-medium text-xl py-2">Question</p>
        </div>
        {currentUser?.role === "teacher" && (
          <button
            disabled={completed}
            onClick={() => handleDeleteQuestion(questionIndex)}
            className="bg-violet-300 py-2 hover:bg-violet-200 hover:text-black/70 h-full transition-all duration-300 text-black font-medium text-lg rounded-md px-2"
          >
            <FiTrash size={24} />
          </button>
        )}
      </div>
      <TextareaAutosize
        disabled={completed || currentUser?.role === "student"}
        value={question}
        onChange={(e) => handleQuestionUpdate(questionIndex, e.target.value)}
        className="w-full outline-0 text-lg resize-none p-3 font-medium bg-neutral-200 rounded-md read-only:cursor-default"
        placeholder="Enter the question"
      />
      <p className="text-black font-medium text-base">Answers</p>
      {/* ### ANSWERS ### */}
      <div
        className={`grid ${
          currentUser?.role == "teacher"
            ? "grid-cols-[auto_1fr_auto_auto]"
            : "grid-cols-[auto_1fr]"
        } gap-5 items-center`}
      >
        {options.map((option, optionIndex) => {
          const isAnswer = option === correctAnswer;
          const isSelected = option === selectedAnswer;
          return (
            <>
              {/* Option Number */}
              <p
                key={`${questionIndex}-${option}_option_num`}
                className="text-black font-medium text-lg self-center h-full content-center bg-pink-300 w-8 text-center rounded-md"
              >
                {optionIndex + 1}.
              </p>
              {/* Option */}
              {currentUser?.role === "teacher" ? (
                <TextareaAutosize
                  disabled={completed}
                  value={option}
                  className="w-full outline-0 text-base resize-none p-2 bg-neutral-200 rounded-md read-only:cursor-default"
                  placeholder="Enter the option"
                  onChange={(e) =>
                    handleOptionUpdate(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                />
              ) : (
                <button
                  onClick={() => handleSelectAnswer(questionIndex, option)}
                  className={`w-full text-base p-2 bg-neutral-200 text-left rounded-md ${
                    isSelected
                      ? "bg-violet-300"
                      : "bg-neutral-200 hover:bg-violet-200"
                  }`}
                >
                  {option}
                </button>
              )}
              {/* Answer */}
              {currentUser?.role === "teacher" && (
                <>
                  <button
                    onClick={() => handleAnswerUpdate(questionIndex, option)}
                    disabled={completed}
                    key={`${questionIndex}-${option}_answer`}
                    className={` ${
                      isAnswer ? "bg-sky-300 " : "bg-sky-100 hover:bg-sky-200"
                    } hover:text-black/70 h-full transition-all duration-300 text-black font-medium text-lg rounded-md px-2`}
                  >
                    {isAnswer ? (
                      <GrFormCheckmark size={22} />
                    ) : (
                      <GrFormClose size={22} />
                    )}
                  </button>
                  {/* Delete Option */}
                  <button
                    onClick={() =>
                      handleDeleteOption(questionIndex, optionIndex)
                    }
                    disabled={completed}
                    key={`${optionIndex}-${option}_delete`}
                    className="bg-violet-300 hover:bg-violet-200 hover:text-black/70 h-full transition-all duration-300 text-black font-medium text-lg rounded-md px-2"
                  >
                    <FiTrash />
                  </button>
                </>
              )}
            </>
          );
        })}
        {currentUser?.role === "teacher" && (
          <>
            {/* ### ADD OPTION BUTTON ### */}
            <button
              onClick={() => handleAddOption(questionIndex)}
              disabled={completed}
              className="text-black font-medium text-lg self-center h-full content-center bg-violet-300 hover:bg-violet-200 hover:text-black/70 transition-all duration-300 w-8 text-center rounded-md py-2"
            >
              <GrAdd className="mx-auto" size={16} />
            </button>
            <p>Add Option</p>
          </>
        )}
      </div>
    </div>
  );
};
