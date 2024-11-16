import { useState } from "react";
import { getExams, createExam } from "@/api/dal/exams";
import { Exam } from "@prisma/client";

interface UseExamsReturn {
  exams: Exam[] | null;
  loading: boolean;
  error: Error | null;
  fetchExams: () => Promise<void>;
  newExam: (data: Omit<Exam, "id">) => Promise<Exam | null>;
}

export function useExams(): UseExamsReturn {
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await getExams();
      setExams(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const newExam = async (data: Omit<Exam, "id">) => {
    try {
      const response = await createExam(data);
      return response;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { exams, loading, error, fetchExams, newExam };
} 