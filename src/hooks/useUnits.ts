import { useState, useCallback } from "react";
import { Unit } from "@prisma/client";
import { unitApi } from "@/lib/api/units";

export function useGetUnits() {
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUnits = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const data = await unitApi.getAll();
      setUnits(data);
    } catch (err) {
      console.error("Error in useGetUnits:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch units"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { units, loading, error, fetchUnits };
}

export function useCreateUnit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleCreateUnit = useCallback(
    async (data) => {
      console.log("HOOK: ", data);
      if (loading) return;

      try {
        setLoading(true);
        setError(null);
        const result = await unitApi.create(data);
        return result;
      } catch (err) {
        console.error("Error in useCreateUnit:", err);
        const error =
          err instanceof Error ? err : new Error("Failed to create unit");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  return { createUnit: handleCreateUnit, loading, error };
}
