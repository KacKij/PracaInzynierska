package pl.kijowski.przychodnialekarska.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private User doctor;

    private LocalDateTime visitDateStart;
    private LocalDateTime visitDateEnd;

    private String reason;
    private String status;
    private boolean active;

}
