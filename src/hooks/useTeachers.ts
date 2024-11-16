import { useState } from "react";
import { getTeachers, createTeacher } from "@/api/dal/teachers";
import { Teacher } from "@prisma/client";

interface UseTeachersReturn {
  teachers: Teacher[] | null;
  loading: boolean;
  error: Error | null;
  fetchTeachers: () => Promise<void>;
  newTeacher: (data: Omit<Teacher, "id">) => Promise<Teacher | null>;
}

export function useTeachers(): UseTeachersReturn {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getTeachers();
      setTeachers(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const newTeacher = async (data: Omit<Teacher, "id">) => {
    try {
      const response = await createTeacher(data);
      return response;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { teachers, loading, error, fetchTeachers, newTeacher };
} 