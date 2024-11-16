import { useState } from "react";
import { getTeachers, createTeacher } from "@/api/dal/teachers";
import { Teacher } from "@prisma/client";

interface UseTeachersReturn {
  teachers: Teacher[] | null;
  loading: boolean;
  error: Error | null;
  fetchTeachers: () => Promise<void>;
  createNewTeacher: (data: Omit<Teacher, "id">) => Promise<Teacher>;
}

export function useTeachers(): UseTeachersReturn {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTeacher = async (data: Omit<Teacher, "id">) => {
    return await createTeacher(data);
  };

  return { teachers, loading, error, fetchTeachers, createNewTeacher };
}
