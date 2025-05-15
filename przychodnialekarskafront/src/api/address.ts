export interface AddressDto {
    street: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
    streetNumber: string;
    apartmentNumber: string;
  }
  
  export async function updateUserAddress(address: AddressDto): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
  
    const res = await fetch("http://localhost:8080/api/dashboard/me/address", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });
  
    if (!res.ok) {
      throw new Error(await res.text());
    }
  }