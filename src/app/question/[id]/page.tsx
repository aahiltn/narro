"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@prisma/client";

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await fetch(`/api/questions/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        setQuestion(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/TeacherPage");
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
          <h1 className="mb-8 text-2xl font-bold">Question #1</h1>

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
              Describe the Above Image In Spanish:{" "}
            </h2>
            <p className="text-sm text-gray-500">
              hint: Describe the colors, objects, actions, people, and the place
              you see in the image.
            </p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.prompt}
            className="w-full mb-8 min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#EA5658]"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>Back</span>
            </button>
            <button className="px-4 py-2 bg-[#EA5658] text-white rounded-lg hover:bg-[#EB5759]">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 w-full">
        <div className="h-2 bg-[#EA5658]" style={{ width: "12.5%" }}></div>
      </div>
    </div>
  );
}
