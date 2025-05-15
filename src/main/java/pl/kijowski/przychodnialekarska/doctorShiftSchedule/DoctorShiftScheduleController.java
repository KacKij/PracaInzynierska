package pl.kijowski.przychodnialekarska.doctorShiftSchedule;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.kijowski.przychodnialekarska.model.DoctorShiftSchedule;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.user.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/doctors/{docId}/shifts")
public class DoctorShiftScheduleController {
    private final DoctorShiftScheduleService svc;
    private final UserRepository userRepo;

    public DoctorShiftScheduleController(DoctorShiftScheduleService svc, UserRepository userRepo) {
        this.svc = svc; this.userRepo = userRepo;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SCHEDULER','ROLE_ADMIN')")
    public List<DoctorShiftSchedule> list(@PathVariable Long docId) {
        return svc.getShiftsForDoctor(docId);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SCHEDULER','ROLE_ADMIN')")
    public ResponseEntity<DoctorShiftSchedule> create(
            @PathVariable Long docId,
            @RequestBody DoctorShiftSchedule shift
    ) {
        User doctor = userRepo.findById(docId.intValue())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid doctor"));
        shift.setDoctor(doctor);
        return ResponseEntity.ok(svc.saveShift(shift));
    }
}