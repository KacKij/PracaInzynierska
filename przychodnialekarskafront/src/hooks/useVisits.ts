import { useEffect, useState, useCallback } from "react";
import { fetchVisits, createVisit as apiCreateVisit, Visit, NewVisit } from "../api/visits";

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVisits();
      setVisits(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createVisit = async (payload: NewVisit) => {
    setLoading(true);
    try {
      const newVisit = await apiCreateVisit(payload);
      await load();
      return newVisit;
    } finally {
      setLoading(false);
    }
  };

  return { visits, loading, error, createVisit, reload: load };
}