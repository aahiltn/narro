import { useState } from "react";
import { getSections, createSection } from "@/api/dal/class-sections";
import { ClassSection } from "@prisma/client";

interface UseClassSectionsReturn {
  sections: ClassSection[] | null;
  loading: boolean;
  error: Error | null;
  fetchSections: () => Promise<void>;
  newSection: (data: Omit<ClassSection, "id">) => Promise<ClassSection | null>;
}

export function useClassSections(): UseClassSectionsReturn {
  const [sections, setSections] = useState<ClassSection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await getSections();
      setSections(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const newSection = async (data: Omit<ClassSection, "id">) => {
    try {
      const response = await createSection(data);
      return response;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { sections, loading, error, fetchSections, newSection };
}
