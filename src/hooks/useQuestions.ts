import { useState } from "react";
import { getQuestions, createQuestion } from "@/api/dal/questions";
import { Question } from "@prisma/client";

interface UseQuestionsReturn {
  questions: Question[] | null;
  loading: boolean;
  error: Error | null;
  fetchQuestions: () => Promise<void>;
  newQuestion: (data: Omit<Question, "id">) => Promise<Question | null>;
}

export function useQuestions(): UseQuestionsReturn {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuestions();
      setQuestions(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const newQuestion = async (data: Omit<Question, "id">) => {
    try {
      const response = await createQuestion(data);
      return response;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { questions, loading, error, fetchQuestions, newQuestion };
} 