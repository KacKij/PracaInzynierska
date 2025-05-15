package pl.kijowski.przychodnialekarska.patient;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.kijowski.przychodnialekarska.address.AddressRepository;
import pl.kijowski.przychodnialekarska.dto.PatientDto;
import pl.kijowski.przychodnialekarska.dto.PatientInfoDto;
import pl.kijowski.przychodnialekarska.dto.PatientRegisterDto;
import pl.kijowski.przychodnialekarska.model.Address;
import pl.kijowski.przychodnialekarska.model.Patient;
import pl.kijowski.przychodnialekarska.user.UserRepository;
import pl.kijowski.przychodnialekarska.util.PeselUtil;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public PatientController(PatientService patientService, UserRepository userRepository, AddressRepository addressRepository) {
        this.patientService = patientService;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @GetMapping
    public ResponseEntity<List<PatientDto>> getAllPatients() {
        boolean isAdmin = hasRole("ROLE_ADMIN");
        List<PatientDto> dtos = patientService.getAllPatients().stream()
                .map(p -> new PatientDto(p, isAdmin))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(p -> ResponseEntity.ok(new PatientDto(p, hasRole("ROLE_ADMIN"))))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<?> getPatientInfo(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(patient -> {
                    boolean isAdmin = hasRole("ROLE_ADMIN");
                    return ResponseEntity.ok(new PatientInfoDto(patient, isAdmin));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pesel/{pesel}")
    public ResponseEntity<?> getPatientByPesel(@PathVariable String pesel) {
        return patientService.getPatientByPesel(pesel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> createPatient(@RequestBody PatientRegisterDto dto, Principal principal) {
        if (patientService.existsByPesel(dto.getPesel())) {
            return ResponseEntity.badRequest().body("Patient with this PESEL already exists.");
        }

        Address address = new Address();
        address.setStreet(dto.getAddress().getStreet());
        address.setCity(dto.getAddress().getCity());
        address.setZipCode(dto.getAddress().getZipCode());
        address.setState(dto.getAddress().getState());
        address.setCountry(dto.getAddress().getCountry());
        address.setStreetNumber(dto.getAddress().getStreetNumber());
        address.setApartmentNumber(dto.getAddress().getApartmentNumber());

        Address savedAddress = addressRepository.save(address);

        Patient patient = new Patient();
        patient.setFirstname(dto.getFirstname());
        patient.setLastname(dto.getLastname());
        patient.setPesel(dto.getPesel());
        patient.setEmail(dto.getEmail());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setPhoneNumberExt(dto.getPhoneNumberExt());
        patient.setDateOfBirth(PeselUtil.extractDateOfBirth(dto.getPesel()));
        patient.setGender(PeselUtil.extractGender(dto.getPesel()));
        patient.setAddress(savedAddress);
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());

        if (principal != null) {
            userRepository.findByEmail(principal.getName()).ifPresent(patient::setCreatedBy);
        }

        return ResponseEntity.ok(new PatientDto(patientService.savePatient(patient), hasRole("ROLE_ADMIN")));
    }

    @PutMapping("/{id}")  
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        return patientService.getPatientById(id)
                .map(existing -> {
                    updatedPatient.setId(existing.getId());
                    return ResponseEntity.ok(patientService.savePatient(updatedPatient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        if (!patientService.getPatientById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        patientService.deletePatient(id);
        return ResponseEntity.ok("Deleted");
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
    }
}