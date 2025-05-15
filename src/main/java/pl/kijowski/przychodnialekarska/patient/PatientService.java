package pl.kijowski.przychodnialekarska.patient;

import org.springframework.stereotype.Service;
import pl.kijowski.przychodnialekarska.model.Patient;
import pl.kijowski.przychodnialekarska.model.User;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByPesel(String pesel) {
        return patientRepository.getPatientByPesel(pesel);
    }

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public boolean existsByPesel(String pesel) {
        return patientRepository.existsByPesel(pesel);
    }
}