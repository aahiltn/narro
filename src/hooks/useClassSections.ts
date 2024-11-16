import { useState } from "react";
import { api } from "@/lib/axios";
import { ClassSection } from "@prisma/client";

interface UseClassSectionsReturn {
  sections: ClassSection[] | null;
  loading: boolean;
  error: Error | null;
  fetchSections: () => Promise<void>;
  createSection: (data: Omit<ClassSection, "id">) => Promise<ClassSection>;
}

export function useClassSections(): UseClassSectionsReturn {
  const [sections, setSections] = useState<ClassSection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await api.get("/class-sections");
      setSections(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (data: Omit<ClassSection, "id">) => {
    const response = await api.post("/class-sections", data);
    return response.data;
  };

  return { sections, loading, error, fetchSections, createSection };
}
