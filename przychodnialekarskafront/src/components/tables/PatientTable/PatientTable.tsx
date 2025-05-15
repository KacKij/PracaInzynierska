import { useState } from "react";
import PatientInfoCard from '../../PatientInfo/PatientInfoCard';
import PatientAddressCard from "../../PatientInfo/PatientAddressCard";
import PatientStaticCard from "../../PatientInfo/PatientStaticCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { usePatients } from "../../../hooks/usePatients";

import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

import { AddressDto } from "../../../api/address";

import { fetchPatientInfo, PatientInfo, registerPatient } from "../../../api/patients";
import { EnvelopeIcon } from "../../../icons";
import PhoneInput from "../../form/group-input/PhoneInput";

const defaultAvatar = "/images/user/user-17.jpg"; // Placeholder image

export default function PatientTable() {
  const { patients, loading, error } = usePatients();

  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const openDetailModal = async (id: number) => {
    try {
      const data = await fetchPatientInfo(id);
      setSelectedPatient(data);
      setIsDetailOpen(true);
    } catch (error) {
      console.error("Failed to load patient info:", error)
    }
  };
  const closeDetailModal = () => {
    setSelectedPatientId(null);
    setIsDetailOpen(false);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberExt, setPhoneNumberExt] = useState("");

  const countries = [
    { code: "PL", label: "+48" },  // Poland

    { code: "DE", label: "+49" },  // Germany
    { code: "UA", label: "+380" }, // Ukraine
    { code: "GB", label: "+44" },  // United Kingdom 
    { code: "NL", label: "+31" },  // Netherlands 
    { code: "IE", label: "+353" }, // Ireland
    { code: "NO", label: "+47" },  // Norway
    { code: "BE", label: "+32" },  // Belgium
    { code: "CZ", label: "+420" }, // Czech Republic
    { code: "SK", label: "+421" }, // Slovakia
    { code: "LT", label: "+370" }, // Lithuania
    { code: "BY", label: "+375" }, // Belarus

    { code: "US", label: "+1" },   // United States
    { code: "CA", label: "+1" },   // Canada
    { code: "FR", label: "+33" },  // France
    { code: "IT", label: "+39" },  // Italy
    { code: "ES", label: "+34" },  // Spain
    { code: "SE", label: "+46" },  // Sweden
    { code: "AT", label: "+43" },  // Austria
    { code: "CH", label: "+41" },  // Switzerland
    { code: "AU", label: "+61" },  // Australia
  ];

  const [pesel, setPesel] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");

  const [peselError, setPeselError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const address: AddressDto = {
    street,
    city,
    zipCode,
    state,
    country,
    streetNumber,
    apartmentNumber,
  };

  const validatePeselControlDigit = (pesel: string): boolean => {
    if (!/^\d{11}$/.test(pesel)) return false;

    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = weights.reduce((acc, weight, index) => {
      return acc + weight * parseInt(pesel[index]);
    }, 0);

    const controlDigit = (10 - (sum % 10)) % 10;
    return controlDigit === parseInt(pesel[10]);
  };

  const extractDateOfBirth = (pesel: string): string => {
    const year = parseInt(pesel.slice(0, 2), 10);
    let month = parseInt(pesel.slice(2, 4), 10);
    const day = parseInt(pesel.slice(4, 6), 10);

    let fullYear = 1900 + year;
    if (month > 80) { fullYear = 1800 + year; month -= 80; }
    else if (month > 60) { fullYear = 2200 + year; month -= 60; }
    else if (month > 40) { fullYear = 2100 + year; month -= 40; }
    else if (month > 20) { fullYear = 2000 + year; month -= 20; }

    const mm = month.toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${fullYear}-${mm}-${dd}`;
  };

  const extractGender = (pesel: string): string => {
    if (pesel.length !== 11) return "";
    const genderDigit = parseInt(pesel[9], 10);
    return genderDigit % 2 === 0 ? "Female" : "Male";
  };

  const handlePeselChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPesel(value);

    const valid = /^\d{11}$/.test(value) && validatePeselControlDigit(value);
    setPeselError(!valid);

    if (valid) {
      setDateOfBirth(extractDateOfBirth(value));
      setGender(extractGender(value));
    } else {
      setDateOfBirth("");
      setGender("");
    }
  };

  const validateEmail = (value: string): boolean => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(!isValidEmail);
    return isValidEmail;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmitRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate all fields
    const requiredFields = [firstName, lastName, email, phoneNumber, phoneNumberExt, pesel, gender, dateOfBirth, street, city, zipCode, state, country, streetNumber];
    const hasEmpty = requiredFields.some(f => f.trim() === "");
    const isEmailValid = validateEmail(email);
    const isPeselValid = /^\d{11}$/.test(pesel) && validatePeselControlDigit(pesel);
  
    if (hasEmpty || !isEmailValid || !isPeselValid) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const trimmedPhoneNumber = phoneNumber
    .replace(phoneNumberExt, "")
    .trim()
    .replace(/^\s+/, "");
  
    const payload = {
      firstname: firstName,
      lastname: lastName,
      email,
      phoneNumber: trimmedPhoneNumber,
      phoneNumberExt,
      pesel,
      gender,
      dateOfBirth,
      address: {
        street,
        city,
        zipCode,
        state,
        country,
        streetNumber,
        apartmentNumber,
      },
    };
  
    try {
      await registerPatient(payload);
      closeRegisterModal();
      window.location.reload(); // or call a data refresh function
    } catch (err) {
      console.error(err);
      alert("Error while registering patient");
    }
  };


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Button */}
      <div className="flex justify-end p-4">
        <Button onClick={openRegisterModal}>Register New Patient</Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                Patient
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                PESEL
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                Phone
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                Gender
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">
                Birthdate
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.02]"
                    onClick={() => openDetailModal(patient.id)}>
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={defaultAvatar}
                        alt={patient.firstname + " " + patient.lastname}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {patient.firstname} {patient.lastname}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.pesel}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.email}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.phoneNumberExt + " " + patient.phoneNumber}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      patient.gender === "Female" ? "success" : "primary"
                    }
                  >
                    {patient.gender === "Female" ? "Female" : "Male"}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                  {patient.dateOfBirth}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Modal */}
      {/* Register Patient Modal */}
      <Modal isOpen={isRegisterOpen} onClose={closeRegisterModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="mb-6">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Register New Patient
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in the details to create a new patient record.
            </p>
          </div>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmitRegisterPatient}>
            {/* Names */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>First Name</Label>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            {/* PESEL */}
            <div>
              <Label>PESEL</Label>
              <Input
                type="text"
                value={pesel}
                error={peselError}
                onChange={handlePeselChange}
                placeholder="Enter 11-digit PESEL"
                hint={peselError ? "Invalid PESEL format" : ""}
              />
            </div>

            {/* Extracted Gender and DOB */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Gender</Label>
                <Input type="text" value={gender} disabled />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="text" value={dateOfBirth} disabled />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Input
                    type="email"
                    className="pl-[62px]"
                    value={email}
                    error={emailError}
                    onChange={handleEmailChange}
                    placeholder="example@email.com"
                  />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <EnvelopeIcon className="size-6" />
                  </span>
                </div>
                <div className="min-h-[20px] mt-1 text-xs text-red-500">
                  {emailError ? "Invalid email address" : "\u00A0" /* non-breaking space */}
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <PhoneInput
                  selectPosition="start"
                  countries={countries}
                  placeholder="+48 123 654 789"
                  onChange={(fullNumber, ext) => {
                    setPhoneNumber(fullNumber);
                    setPhoneNumberExt(ext);
                  }}
                />
              </div>
            </div>
            <br />

            {/* Address Section */}
            <div className="bg-gray-50 dark:bg-white/[0.02] rounded-xl p-4">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-4">Address</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label>Street</Label>
                  <Input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div>
                  <Label>Street Number</Label>
                  <Input type="text" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
                </div>
                <div>
                  <Label>Apartment Number</Label>
                  <Input type="text" value={apartmentNumber} onChange={(e) => setApartmentNumber(e.target.value)} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <Label>Zip Code</Label>
                  <Input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
                <div>
                  <Label>State</Label>
                  <Input type="text" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className="lg:col-span-2">
                  <Label>Country</Label>
                  <Input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeRegisterModal}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save Patient
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Patient Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={closeDetailModal} className="max-w-[700px] m-4">
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h4>
              <div className="text-gray-500 dark:text-gray-400 w-full">
                {selectedPatient && (
                  <PatientInfoCard
                    firstname={selectedPatient.firstname}
                    lastname={selectedPatient.lastname}
                    email={selectedPatient.email}
                    phoneNumber={selectedPatient.phoneNumberExt + " " +selectedPatient.phoneNumber}
                  />
                )}

                {!selectedPatient?.address && (
                  <p className="text-red-500 text-sm">No address found or still loading...</p>
                )}

                {selectedPatient?.address && (
                  <>
                    <br />
                    <PatientAddressCard
                      street={selectedPatient.address.street || "N/A"}
                      streetNumber={selectedPatient.address.streetNumber || "N/A"}
                      apartmentNumber={selectedPatient.address.apartmentNumber || "N/A"}
                      zipCode={selectedPatient.address.zipCode || "N/A"}
                      city={selectedPatient.address.city || "N/A"}
                      state={selectedPatient.address.state || "N/A"}
                      country={selectedPatient.address.country || "N/A"}
                    />
                  </>
                )}
                <br />
                {selectedPatient && (
                  <PatientStaticCard
                    pesel={selectedPatient.pesel}
                    gender={selectedPatient.gender}
                    dateOfBirth={selectedPatient.dateOfBirth}
                    lastVisitDate={selectedPatient.lastVisitDate}
                    lastVisitDoctor={selectedPatient.lastVisitDoctor}
                    createdAt={selectedPatient.createdAt}
                    updatedAt={selectedPatient.updatedAt}
                  />
                )}
              </div>
              <div className="flex justify-end mt-6">
                <Button size="sm" variant="outline" onClick={closeDetailModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
