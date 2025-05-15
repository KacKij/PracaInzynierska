package pl.kijowski.przychodnialekarska.dto;

import lombok.Data;
import pl.kijowski.przychodnialekarska.model.Patient;

import java.time.LocalDate;

@Data
public class PatientDto {

    private Long id;
    private String firstname;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;
    private String phoneNumberExt;
    private String gender;
    private LocalDate dateOfBirth;

    public PatientDto(Patient patient, boolean isAdmin) {
        this.id = patient.getId();
        this.firstname = patient.getFirstname();
        this.lastname = patient.getLastname();
        this.email = patient.getEmail();
        this.phoneNumber = patient.getPhoneNumber();
        this.phoneNumberExt = patient.getPhoneNumberExt();
        this.gender = patient.getGender();
        this.dateOfBirth = patient.getDateOfBirth();

        if (isAdmin) {
            this.pesel = patient.getPesel();
        } else {
            this.pesel = maskPesel(patient.getPesel());
        }
    }

    private String maskPesel(String pesel) {
        if (pesel == null || pesel.length() < 11) return "***********";
        return pesel.substring(0, 6) + "*" + pesel.charAt(7) + "***";
    }
}