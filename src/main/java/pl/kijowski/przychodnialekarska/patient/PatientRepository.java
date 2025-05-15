package pl.kijowski.przychodnialekarska.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.kijowski.przychodnialekarska.model.Patient;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByPesel(String pesel);

    Optional<Patient> getPatientByPesel(String pesel);
}