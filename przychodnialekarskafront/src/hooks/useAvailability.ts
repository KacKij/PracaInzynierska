import { useState, useCallback } from "react";
import { fetchAvailableSlots, Slot } from "../api/availability";

export function useAvailability() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load available slots for a given doctor, date, and duration.
   * @param doctorId the doctor's ID
   * @param date a string in "YYYY-MM-DD" format
   * @param duration desired slot length in minutes (15,30,45,60)
   */
  const loadSlots = useCallback(
    async (doctorId: number, date: string, duration: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAvailableSlots(doctorId, date, duration);
        setSlots(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load availability");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { slots, loading, error, loadSlots };
}