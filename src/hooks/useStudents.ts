import { useState } from "react";
import { api } from "@/lib/axios";
import { Student } from "@prisma/client";

interface UseStudentsReturn {
  students: Student[] | null;
  loading: boolean;
  error: Error | null;
  fetchStudents: () => Promise<void>;
  createStudent: (data: Omit<Student, "id">) => Promise<Student>;
}

export function useStudents(): UseStudentsReturn {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (data: Omit<Student, "id">) => {
    const response = await api.post("/students", data);
    return response.data;
  };

  return { students, loading, error, fetchStudents, createStudent };
}
