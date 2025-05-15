export interface Visit {
    id: number;
    patientName: string;
    patientId: number;
    doctorName: string;
    doctorId: number;
    reason: string;
    status: string;
    visitDateStart: string;
    visitDateEnd: string;
  }

  export interface NewVisit {
    patientId: number;
    doctorId: number;
    visitDateStart: string;
    visitDateEnd: string;
    reason: string;
  }
  
  const BASE = "http://localhost:8080/api/visits";

  export async function fetchVisits(): Promise<Visit[]> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
  
    const res = await fetch(BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch visits");
    return res.json();
  }


  export async function createVisit(payload: NewVisit): Promise<Visit> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
  
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create visit");
    return res.json();
  }