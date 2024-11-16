import { useState } from "react";
import { getUnits, createUnit } from "@/api/dal/units";
import { Unit } from "@prisma/client";

interface UseUnitsReturn {
  units: Unit[] | null;
  loading: boolean;
  error: Error | null;
  fetchUnits: () => Promise<void>;
  newUnit: (data: Omit<Unit, "id">) => Promise<Unit | null>;
}

export function useUnits(): UseUnitsReturn {
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await getUnits();
      setUnits(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const newUnit = async (data: Omit<Unit, "id">) => {
    try {
      const response = await createUnit(data);
      return response;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { units, loading, error, fetchUnits, newUnit };
} 