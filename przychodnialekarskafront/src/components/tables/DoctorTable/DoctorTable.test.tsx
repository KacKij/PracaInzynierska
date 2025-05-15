import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import DoctorTable from "./DoctorTable";
import { useDoctors } from "../../../hooks/useDoctors";
import { fetchDoctorInfo } from "../../../api/doctors";

// 1) Mock the hooks + API
jest.mock("../../../hooks/useDoctors");
jest.mock("../../../api/doctors");

describe("DoctorTable component", () => {
  // 2) Fake doctors list
  const mockDoctors = [
    {
      id: 1,
      firstname: "Alice",
      lastname: "Smith",
      pesel: "11111111111",
      email: "alice@example.com",
      phoneNumber: "123456789",
      phoneNumberExt: "+1",
      gender: "Female",
      dateOfBirth: "1990-01-01",
    },
    {
      id: 2,
      firstname: "Bob",
      lastname: "Jones",
      pesel: "22222222222",
      email: "bob@example.com",
      phoneNumber: "987654321",
      phoneNumberExt: "+1",
      gender: "Male",
      dateOfBirth: "1980-02-02",
    },
  ];

  // 3) Fake detailed info for one doctor
  const mockDoctorInfo = {
    id: 1,
    firstname: "Alice",
    lastname: "Smith",
    pesel: "11111111111",
    email: "alice@example.com",
    phoneNumber: "123456789",
    phoneNumberExt: "+1",
    gender: "Female",
    dateOfBirth: "1990-01-01",
    address: {
      street: "Main St",
      streetNumber: "10",
      apartmentNumber: "5A",
      zipCode: "12345",
      city: "Townsville",
      state: "State",
      country: "Country",
    },
    lastVisitDate: null,
    lastVisitDoctor: 0,
    createdAt: "2025-05-01T10:00:00",
    updatedAt: "2025-05-02T11:00:00",
    createdByName: "Admin User",
  };

  beforeEach(() => {
    // Hook returns our fake doctors
    (useDoctors as jest.Mock).mockReturnValue({
      doctors: mockDoctors,
      loading: false,
      error: null,
    });
    // API returns our detailed info
    (fetchDoctorInfo as jest.Mock).mockResolvedValue(mockDoctorInfo);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders doctor rows and opens detail modal with correct data", async () => {
    render(<DoctorTable />);

    // a) Table rows
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();

    // b) Click Alice's row
    fireEvent.click(screen.getByText("Alice Smith"));

    // c) Wait for API to be called
    await waitFor(() => {
      expect(fetchDoctorInfo).toHaveBeenCalledWith(1);
    });
  });

  it("validates Register Doctor form: shows alert when password is missing", () => {
    // spy on window.alert
    const alertMock = jest
      .spyOn(window, "alert")
      .mockImplementation(() => {});

    render(<DoctorTable />);

    // a) Open the "Register New Doctor" modal
    fireEvent.click(screen.getByText("Register New Doctor"));

    // b) Attempt to save without filling any fields
    fireEvent.click(screen.getByText("Save Doctor"));

    // c) Expect the validation alert
    expect(alertMock).toHaveBeenCalledWith(
      "Please fill in all required fields correctly."
    );

    alertMock.mockRestore();
  });
});