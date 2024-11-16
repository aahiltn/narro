import { useState } from "react";
import { api } from "@/lib/axios";
import { Question } from "@prisma/client";

interface UseQuestionsReturn {
  questions: Question[] | null;
  loading: boolean;
  error: Error | null;
  fetchQuestions: () => Promise<void>;
  createQuestion: (data: Omit<Question, "id">) => Promise<Question>;
}

export function useQuestions(): UseQuestionsReturn {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/questions");
      setQuestions(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (data: Omit<Question, "id">) => {
    const response = await api.post("/questions", data);
    return response.data;
  };

  return { questions, loading, error, fetchQuestions, createQuestion };
}
