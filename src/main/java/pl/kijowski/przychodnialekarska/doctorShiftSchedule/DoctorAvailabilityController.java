package pl.kijowski.przychodnialekarska.doctorShiftSchedule;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.kijowski.przychodnialekarska.dto.SlotDto;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors/{doctorId}")
public class DoctorAvailabilityController {

    private final DoctorShiftScheduleService shiftService;

    public DoctorAvailabilityController(DoctorShiftScheduleService shiftService) {
        this.shiftService = shiftService;
    }

    /**
     * Returns all available slots of the given duration (in minutes)
     * for the specified doctor on the given date.
     * Duration must be one of: 15, 30, 45, or 60.
     */
    @GetMapping("/available-slots")
    @PreAuthorize("hasAnyAuthority('ROLE_SCHEDULER','ROLE_ADMIN','ROLE_USER')")
    public ResponseEntity<List<SlotDto>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam int duration
    ) {
        // (You’ll implement this method in your service next)
        List<SlotDto> slots = shiftService.getAvailableSlots(doctorId, date, duration);
        return ResponseEntity.ok(slots);
    }
}