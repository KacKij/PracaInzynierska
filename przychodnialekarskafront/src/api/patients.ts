export interface Patient {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    phoneNumberExt: string;
    pesel: string;
    gender: string;
    dateOfBirth: string;
    lastVisitDate?: string;
    lastVisitDoctor?: number;
}

export interface PatientInfo {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    phoneNumberExt: string;
    pesel: string;
    gender: string;
    dateOfBirth: string;
    lastVisitDate?: string;
    lastVisitDoctor?: number;
    address?: {
      street: string;
      city: string;
      zipCode: string;
      state: string;
      country: string;
      streetNumber: string;
      apartmentNumber: string;
    };
    createdBy?: {
      firstname: string;
      lastname: string;
      email: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }

  export interface PatientRegisterDto {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    phoneNumberExt: string;
    pesel: string;
    gender: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
      state: string;
      country: string;
      streetNumber: string;
      apartmentNumber: string;
    };
  }

export async function fetchPatients(): Promise<Patient[]> {

    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch("http://localhost:8080/api/patients", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch patients");
    }

    return res.json();
}

export async function fetchPatientInfo(id: number): Promise<PatientInfo> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
  
    const res = await fetch(`http://localhost:8080/api/patients/info/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch patient info");
    }
  
    const raw = await res.json();

  return {
    ...raw,
    address: {
      street: raw.street,
      city: raw.city,
      zipCode: raw.zipCode,
      state: raw.state,
      country: raw.country,
      streetNumber: raw.streetNumber,
      apartmentNumber: raw.apartmentNumber,
    },
  }
}

export async function registerPatient(patient: PatientRegisterDto): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("http://localhost:8080/api/patients/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patient),
  });

  if (!res.ok) {
    throw new Error("Failed to register patient");
  }
}