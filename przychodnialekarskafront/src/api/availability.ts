
export interface Slot {
    start: string;
    end: string;
}


export async function fetchAvailableSlots(
  doctorId: number,
  date: string,      // "YYYY-MM-DD"
  duration: number
): Promise<Slot[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `http://localhost:8080/api/doctors/${doctorId}/available-slots?date=${date}&duration=${duration}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to load slots");
  return res.json();
}