import { useState, useEffect, useCallback } from "react";
import {
  fetchDoctors,
  registerDoctor,
  Doctor,
  DoctorRegisterDto,
} from "../api/doctors";

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all doctors from the API
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount (and whenever load changes)
  useEffect(() => {
    load();
  }, [load]);


  const createDoctor = useCallback(
    async (payload: DoctorRegisterDto) => {
      setLoading(true);
      try {
        const newDoc = await registerDoctor(payload);
        setDoctors((prev) => [...prev, newDoc]);
        setError(null);
        return newDoc;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    doctors,
    loading,
    error,
    createDoctor,
    reload: load,
  };
}






