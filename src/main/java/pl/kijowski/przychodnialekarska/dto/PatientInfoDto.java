package pl.kijowski.przychodnialekarska.dto;

import lombok.Data;
import pl.kijowski.przychodnialekarska.model.Address;
import pl.kijowski.przychodnialekarska.model.Patient;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientInfoDto {

    private Long id;
    private String firstname;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;
    private String phoneNumberExt;
    private String gender;
    private LocalDate dateOfBirth;

    private LocalDate lastVisitDate;
    private int lastVisitDoctor;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String createdByName;

    // Optional: flatten address fields
    private String street;
    private String city;
    private String zipCode;
    private String state;
    private String country;
    private String streetNumber;
    private String apartmentNumber;

    public PatientInfoDto(Patient patient, boolean isAdmin) {
        this.id = patient.getId();
        this.firstname = patient.getFirstname();
        this.lastname = patient.getLastname();
        this.email = patient.getEmail();
        this.phoneNumber = patient.getPhoneNumber();
        this.phoneNumberExt = patient.getPhoneNumberExt();
        this.gender = patient.getGender();
        this.dateOfBirth = patient.getDateOfBirth();

        this.pesel = isAdmin ? patient.getPesel() : maskPesel(patient.getPesel());

        this.lastVisitDate = patient.getLastVisitDate();
        this.lastVisitDoctor = patient.getLastVisitDoctor();
        this.createdAt = patient.getCreatedAt();
        this.updatedAt = patient.getUpdatedAt();

        this.createdByName = patient.getCreatedBy() != null
                ? patient.getCreatedBy().getFirstname() + " " + patient.getCreatedBy().getLastname()
                : null;

        Address addr = patient.getAddress();
        if (addr != null) {
            this.street = addr.getStreet();
            this.city = addr.getCity();
            this.zipCode = addr.getZipCode();
            this.state = addr.getState();
            this.country = addr.getCountry();
            this.streetNumber = addr.getStreetNumber();
            this.apartmentNumber = addr.getApartmentNumber();
        }
    }

    private String maskPesel(String pesel) {
        if (pesel == null || pesel.length() != 11) return "***********";
        return pesel.substring(0, 6) + "*" + pesel.charAt(7) + "***";
    }
}