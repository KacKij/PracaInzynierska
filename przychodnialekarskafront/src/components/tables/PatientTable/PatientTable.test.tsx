import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import PatientTable from "./PatientTable";
import { usePatients } from "../../../hooks/usePatients";
import { fetchPatientInfo } from "../../../api/patients";

// 1) Tell Jest to mock those modules:
jest.mock("../../../hooks/usePatients");
jest.mock("../../../api/patients");

describe("PatientTable component", () => {
    // 2) Prepare fake data
    const mockPatients = [
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

    const mockPatientInfo = {
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
            city: "Townsville",
            zipCode: "12345",
            state: "State",
            country: "Country",
            streetNumber: "10",
            apartmentNumber: "5A",
        },
        lastVisitDate: null,
        lastVisitDoctor: 0,
        createdAt: "2025-05-01T10:00:00",
        updatedAt: "2025-05-02T11:00:00",
        createdByName: "Admin User",
    };

    beforeEach(() => {
        // 3) Hook returns our fake patients
        (usePatients as jest.Mock).mockReturnValue({
            patients: mockPatients,
            loading: false,
            error: null,
        });

        // 4) fetchPatientInfo returns our detailed info
        (fetchPatientInfo as jest.Mock).mockResolvedValue(mockPatientInfo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("renders patient rows and opens detail modal with correct data", async () => {
        render(<PatientTable />);

        // 5) Table rows are rendered
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
        expect(screen.getByText("Bob Jones")).toBeInTheDocument();

        // 6) Click Alice's row
        fireEvent.click(screen.getByText("Alice Smith"));

        // 7) Wait for the API call
        await waitFor(() => {
            expect(fetchPatientInfo).toHaveBeenCalledWith(1);
        });

        // 8) Wait for the modal to render Alice's details
        await waitFor(() => {
            const allEmails = screen.getAllByText("alice@example.com");
            expect(allEmails.length).toBeGreaterThanOrEqual(2);

            const modalEmail = allEmails.find(el => el.tagName.toLowerCase() === "p");
            expect(modalEmail).toBeInTheDocument();
            // street + number + apt appear as one line:
            expect(screen.getByText("Main St 10 / 5A")).toBeInTheDocument();
            // city
            expect(screen.getByText("Townsville")).toBeInTheDocument();
        });
    })
})
