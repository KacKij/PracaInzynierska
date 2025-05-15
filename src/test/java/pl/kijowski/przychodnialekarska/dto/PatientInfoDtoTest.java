package pl.kijowski.przychodnialekarska.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import pl.kijowski.przychodnialekarska.model.Patient;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class PatientInfoDtoTest {

    private Patient makePatient(String pesel) {
        Patient p = new Patient();
        p.setId(42L);
        p.setFirstname("Test");
        p.setLastname("User");
        p.setPesel(pesel);
        p.setEmail("test@example.com");
        p.setPhoneNumber("123456789");
        p.setPhoneNumberExt("+48");
        p.setGender("Male");
        p.setDateOfBirth(LocalDate.of(1980, 1, 1));
        // leave address null for this test
        return p;
    }

    @Test
    @DisplayName("Non-admins see masked PESEL")
    void whenNotAdmin_peselIsMasked() {
        Patient patient = makePatient("12345678901");
        PatientInfoDto dto = new PatientInfoDto(patient, false);

        // mask logic: first 6 chars, then '*', then char 7, then '***'
        // "123456" + "*" + "8" + "***" == "123456*9***"
        assertEquals("123456*8***", dto.getPesel());
    }

    @Test
    @DisplayName("Admins see full unmasked PESEL")
    void whenAdmin_peselIsUnmasked() {
        Patient patient = makePatient("12345678901");
        PatientInfoDto dto = new PatientInfoDto(patient, true);

        assertEquals("12345678901", dto.getPesel());
    }

    @Test
    @DisplayName("Invalid-length PESEL returns all asterisks for non-admin")
    void invalidPesel_nonAdminAllStars() {
        Patient patient = makePatient("98765"); // too short
        PatientInfoDto dto = new PatientInfoDto(patient, false);

        assertEquals("***********", dto.getPesel());
    }

    @Test
    @DisplayName("Null PESEL returns all asterisks for non-admin")
    void nullPesel_nonAdminAllStars() {
        Patient patient = makePatient(null);
        PatientInfoDto dto = new PatientInfoDto(patient, false);

        assertEquals("***********", dto.getPesel());
    }

    @Test
    @DisplayName("Null PESEL allowed for admin (remains null)")
    void nullPesel_adminKeepsNull() {
        Patient patient = makePatient(null);
        PatientInfoDto dto = new PatientInfoDto(patient, true);

        assertNull(dto.getPesel());
    }
}