import { useState } from "react";
import { getStudents, createStudent } from "@/api/dal/students";
import { Student } from "@prisma/client";

interface UseStudentsReturn {
  students: Student[] | null;
  loading: boolean;
  error: Error | null;
  fetchStudents: () => Promise<void>;
  newStudent: (data: Omit<Student, "id">) => Promise<Student | null>;
}

export function useStudents(): UseStudentsReturn {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      setStudents(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const newStudent = async (data: Omit<Student, "id">) => {
    try {
      const response = await createStudent(data);
      return response;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { students, loading, error, fetchStudents, newStudent };
} 