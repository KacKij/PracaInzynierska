package pl.kijowski.przychodnialekarska.visit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.kijowski.przychodnialekarska.dto.VisitCreateDto;
import pl.kijowski.przychodnialekarska.dto.VisitDto;
import pl.kijowski.przychodnialekarska.model.Patient;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.model.Visit;
import pl.kijowski.przychodnialekarska.patient.PatientRepository;
import pl.kijowski.przychodnialekarska.user.UserRepository;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitService visitService;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public VisitController(VisitService visitService, PatientRepository patientRepository, UserRepository userRepository) {
        this.visitService = visitService;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<VisitDto>> getAllVisits() {
        List<VisitDto> visits = visitService.getAllVisits()
                .stream()
                .map(VisitDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(visits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVisitById(@PathVariable Long id) {
        return visitService.getVisitById(id)
                .map(v -> ResponseEntity.ok(new VisitDto(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VisitDto> createVisit(@RequestBody VisitCreateDto dto, Principal principal) {
        // 1) Lookup patient
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid patient ID"));

        // 2) (temporarily) use the authenticated user as the “doctor”
        User doctor = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Doctor user not found"));

        // 3) Parse the ISO dates
        LocalDateTime start, end;
        try {
            start = LocalDateTime.parse(dto.getVisitDateStart());
            end   = LocalDateTime.parse(dto.getVisitDateEnd());
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid date format, must be ISO-8601", e);
        }

        // 4) Build and save
        Visit visit = new Visit();
        visit.setPatient(patient);
        visit.setDoctor(doctor);
        visit.setVisitDateStart(start);
        visit.setVisitDateEnd(end);
        visit.setReason(dto.getReason());
        visit.setStatus("Scheduled");
        visit.setActive(true);

        Visit saved = visitService.saveVisit(visit);

        // 5) Return a DTO (now patient & doctor are non-null)
        return ResponseEntity.ok(new VisitDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVisit(@PathVariable Long id) {
        visitService.deleteVisit(id);
        return ResponseEntity.ok("Deleted");
    }
}