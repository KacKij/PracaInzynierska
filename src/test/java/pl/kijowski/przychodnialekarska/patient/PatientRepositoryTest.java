package pl.kijowski.przychodnialekarska.patient;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import pl.kijowski.przychodnialekarska.model.Patient;

@DataJpaTest
@TestPropertySource(properties = {
        // ensure the schema is created in H2
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PatientRepositoryTest {

    @Autowired
    private PatientRepository patientRepository;

    private Patient makePatient(String pesel) {
        Patient p = new Patient();
        p.setFirstname("Test");
        p.setLastname("User");
        p.setEmail("test@example.com");
        p.setPesel(pesel);
        p.setPhoneNumber("123456789");
        p.setPhoneNumberExt("+48");
        p.setDateOfBirth(java.time.LocalDate.of(1990,1,1));
        p.setGender("Female");
        return p;
    }

    @Test
    @DisplayName("Saving a patient with a new PESEL works")
    void savePatient_withUniquePesel_succeeds() {
        Patient first = makePatient("90010112345");
        Patient saved = patientRepository.save(first);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPesel()).isEqualTo("90010112345");

        // repository helper also works
        assertThat(patientRepository.existsByPesel("90010112345")).isTrue();
        assertThat(patientRepository.getPatientByPesel("90010112345"))
                .map(Patient::getId)
                .contains(saved.getId());
    }

    @Test
    @DisplayName("Saving a second patient with the same PESEL should fail")
    void savePatient_withDuplicatePesel_throwsException() {
        // first save
        patientRepository.save(makePatient("90010112345"));

        // now a duplicate:
        Patient dup = makePatient("90010112345");
        assertThrows(DataIntegrityViolationException.class, () -> {
            patientRepository.saveAndFlush(dup);
        });
    }
}