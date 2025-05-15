package pl.kijowski.przychodnialekarska.doctorShiftSchedule;


import org.springframework.stereotype.Service;
import pl.kijowski.przychodnialekarska.dto.SlotDto;
import pl.kijowski.przychodnialekarska.model.DoctorShiftSchedule;
import pl.kijowski.przychodnialekarska.model.Visit;
import pl.kijowski.przychodnialekarska.visit.VisitRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DoctorShiftScheduleService {

    private final DoctorShiftScheduleRepository shiftRepo;
    private final VisitRepository visitRepo;

    public DoctorShiftScheduleService(
            DoctorShiftScheduleRepository shiftRepo,
            VisitRepository visitRepo
    ) {
        this.shiftRepo = shiftRepo;
        this.visitRepo = visitRepo;
    }

    public List<DoctorShiftSchedule> getShiftsForDoctor(Long doctorId) {
        return shiftRepo.findByDoctor_Id(doctorId);
    }

    public DoctorShiftSchedule saveShift(DoctorShiftSchedule shift) {
        return shiftRepo.save(shift);
    }

    /**
     * @param doctorId       the doctor to query
     * @param date           the calendar date for slots
     * @param duration       desired visit duration (15,30,45,60)
     * @return a list of free slots of exactly `duration` minutes, stepping by 15 minutes
     */
    public List<SlotDto> getAvailableSlots(Long doctorId, LocalDate date, int duration) {
        // 1. Validate allowed durations
        if (!Set.of(15, 30, 45, 60).contains(duration)) {
            throw new IllegalArgumentException("Duration must be one of 15,30,45,60");
        }

        // 2. Compute full-day bounds
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd   = dayStart.plusDays(1);

        // 3. Fetch this doctor's shifts, clamp to our date
        List<DoctorShiftSchedule> shifts = shiftRepo.findByDoctor_Id(doctorId).stream()
                .filter(s -> s.getEndDateTime().isAfter(dayStart) && s.getStartDateTime().isBefore(dayEnd))
                .toList();

        List<SlotDto> slots = new ArrayList<>();

        for (DoctorShiftSchedule shift : shifts) {
            // clamp shift to [dayStart, dayEnd]
            LocalDateTime windowStart = shift.getStartDateTime().isBefore(dayStart)
                    ? dayStart : shift.getStartDateTime();
            LocalDateTime windowEnd = shift.getEndDateTime().isAfter(dayEnd)
                    ? dayEnd : shift.getEndDateTime();

            // 4. fetch existing visits overlapping our shift window
            List<Visit> visits = visitRepo
                    .findByDoctor_IdAndVisitDateStartLessThanAndVisitDateEndGreaterThan(
                            doctorId, windowEnd, windowStart
                    );

            // 5. Slide a duration-length window by 15-minute increments
            for (LocalDateTime slotStart = windowStart;
                 !slotStart.plusMinutes(duration).isAfter(windowEnd);
                 slotStart = slotStart.plusMinutes(15)) {

                LocalDateTime slotEnd = slotStart.plusMinutes(duration);
                // capture into effectively-final vars
                LocalDateTime sStart = slotStart;
                LocalDateTime sEnd   = slotEnd;

                boolean conflict = visits.stream().anyMatch(v ->
                        v.getVisitDateStart().isBefore(sEnd) &&
                                v.getVisitDateEnd().isAfter(sStart)
                );

                if (!conflict) {
                    // assume SlotDto has default ctor + setters
                    SlotDto slot = new SlotDto();
                    slot.setStart(sStart);
                    slot.setEnd(sEnd);
                    slots.add(slot);
                }
            }
        }

        return slots;
    }
}
