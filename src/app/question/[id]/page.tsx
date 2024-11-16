"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@prisma/client";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { gradeSentence } from "@/api/grader";

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [nextLoading, setNextLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (params.id) {
      setQuestionNumber((prev) => prev + 1);
    }
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch question");
      const data = await response.json();
      setQuestion(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const handleBack = () => {
    setQuestionNumber(1);
    router.push("/TeacherPage");
  };

  const handleSubmit = async () => {
    try {
      if (!question) return error;

      const keywordSet = new Set(question.keywords);
      const finalScore = await gradeSentence(
        answer,
        keywordSet,
        question.language
      );

      setScore(finalScore);
      setShowScore(true);
    } catch (error) {
      console.error("Error grading answer:", error);
      setError("Failed to grade answer");
    }
  };

  const handleNext = async () => {
    try {
      if (!question) return;
      setNextLoading(true);

      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: question.keywords,
          unitDescription: "Practice question",
          language: question.language,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.id) {
        router.push(`/question/${data.data.id}`);
      } else {
        setError("Failed to generate next question");
      }
    } catch (error) {
      console.error("Error generating next question:", error);
      setError("Failed to generate next question");
    } finally {
      setNextLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EA5658] mb-4"></div>
          <p className="text-gray-700">Loading Question...</p>
        </div>
      </div>
    );

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!question) return <div className="p-8">Question not found</div>;

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar */}
      <aside className="w-64 border-r bg-white p-6">
        <div className="mb-8">
          <img src="/Narro-logo.svg" alt="Narro" className="h-8 mb-8" />
          <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2">
            <span className="font-medium">12:30</span>
          </div>
        </div>
        <nav className="space-y-2">
          <button className="w-full rounded-lg px-4 py-2 text-left text-sm bg-[#EA5658] text-white">
            Current Question
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-2xl font-bold">{question.language} Exam</h1>

          <div className="mb-8">
            {question.image && (
              <img
                src={question.image}
                alt="Question visual"
                className="w-full h-64 rounded-lg object-cover"
              />
            )}
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              Describe the Above Image In {question.language}:{" "}
            </h2>
            <p className="text-sm text-gray-500">
              hint: Describe the colors, objects, actions, people, and the place
              you see in the image.
            </p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={"Type your response here..."}
            className="w-full mb-8 min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#EA5658]"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>Back</span>
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Submit
              </button>
              <button
                onClick={handleNext}
                disabled={nextLoading}
                className="px-4 py-2 bg-[#EA5658] text-white rounded-lg hover:bg-[#EB5759] disabled:bg-[#EA5658]/50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {nextLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Next</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score Modal */}
      <HeadlessDialog
        open={showScore}
        onClose={() => setShowScore(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-30" />

          <HeadlessDialog.Panel className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <HeadlessDialog.Title className="text-2xl font-bold mb-4">
              Your Score
            </HeadlessDialog.Title>

            <div className="text-center">
              <div className="text-6xl font-bold text-[#EA5658] mb-4">
                {score?.toFixed(1)}%
              </div>
              <p className="text-gray-600">
                Keep practicing to improve your language skills!
              </p>
            </div>

            <button
              onClick={() => setShowScore(false)}
              className="mt-6 w-full px-4 py-2 bg-[#EA5658] text-white rounded-lg hover:bg-[#EB5759]"
            >
              Close
            </button>
          </HeadlessDialog.Panel>
        </div>
      </HeadlessDialog>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 w-full">
        <div className="h-2 bg-[#EA5658]" style={{ width: "12.5%" }}></div>
      </div>
    </div>
  );
}
