package pl.kijowski.przychodnialekarska.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_shifts")
public class DoctorShiftSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @Setter
    @Getter
    private LocalDateTime startDateTime;

    @Setter
    @Getter
    private LocalDateTime endDateTime;

}
