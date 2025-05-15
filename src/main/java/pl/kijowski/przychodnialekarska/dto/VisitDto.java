package pl.kijowski.przychodnialekarska.dto;

import lombok.Data;
import pl.kijowski.przychodnialekarska.model.Patient;
import pl.kijowski.przychodnialekarska.model.User;

import java.time.LocalDateTime;

@Data
public class VisitDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private int doctorId;
    private String doctorName;
    private LocalDateTime visitDateStart;
    private LocalDateTime visitDateEnd;
    private String reason;
    private String status;
    private boolean active;

    public VisitDto(pl.kijowski.przychodnialekarska.model.Visit visit) {
        this.id = visit.getId();
        this.patientId = visit.getPatient().getId();
        this.patientName = visit.getPatient().getFirstname() + " " + visit.getPatient().getLastname();
        this.doctorId = visit.getDoctor().getId();
        this.doctorName = visit.getDoctor().getFirstname() + " " + visit.getDoctor().getLastname();
        this.visitDateStart = visit.getVisitDateStart();
        this.visitDateEnd = visit.getVisitDateEnd();
        this.reason = visit.getReason();
        this.status = visit.getStatus();
        this.active = visit.isActive();
    }
}