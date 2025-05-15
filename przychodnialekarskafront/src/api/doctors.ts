export interface AddressDto {
    street: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
    streetNumber: string;
    apartmentNumber?: string;
  }
  
  export interface Doctor {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    occupation: string;
    phoneNumber: string;
    phoneNumberExt: string;
    address?: AddressDto;
  }
  
  export interface DoctorInfo extends Doctor {
    roles: string[];
  }
  
  export interface DoctorRegisterDto {
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    occupation: string;
    phone: string;
  }
  
  const BASE = "http://localhost:8080/api/doctors";
  
  export async function fetchDoctors(): Promise<Doctor[]> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
  
    const res = await fetch(BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch doctors (${res.status})`);
    }
    return res.json();
  }
  

  export async function fetchDoctorInfo(id: number): Promise<DoctorInfo> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
  
    const res = await fetch(`${BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch doctor ${id} (${res.status})`);
    }
    return res.json();
  }
  

  export async function registerDoctor(
    payload: DoctorRegisterDto
  ): Promise<Doctor> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
  
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to create doctor (${res.status}): ${text}`);
    }
    return res.json();
  }