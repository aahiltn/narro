import { useState } from "react";
import { api } from "@/lib/axios";
import { Exam } from "@prisma/client";

interface UseExamsReturn {
  exams: Exam[] | null;
  loading: boolean;
  error: Error | null;
  fetchExams: () => Promise<void>;
  createExam: (data: Omit<Exam, "id">) => Promise<Exam>;
}

export function useExams(): UseExamsReturn {
  const [exams, setExams] = useState<Exam[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get("/exams");
      setExams(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createExam = async (data: Omit<Exam, "id">) => {
    const response = await api.post("/exams", data);
    return response.data;
  };

  return { exams, loading, error, fetchExams, createExam };
}
