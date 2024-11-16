"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Question } from "@prisma/client";

export default function QuestionPage() {
  const params = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!question) return <div className="p-8">Question not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generated Question</h1>
      {question.image && (
        <img
          src={question.image}
          alt="Question visual"
          className="w-full max-w-2xl mb-6 rounded-lg shadow-lg"
        />
      )}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Prompt:</h2>
        <p>{question.prompt}</p>
      </div>
    </div>
  );
}
