package pl.kijowski.przychodnialekarska.dto;


import lombok.Data;

@Data
public class VisitCreateDto {
    private Long patientId;
    private Long doctorId;         // we’ll wire this later
    private String visitDateStart; // ISO, e.g. "2025-05-20T14:00:00"
    private String visitDateEnd;
    private String reason;
}
