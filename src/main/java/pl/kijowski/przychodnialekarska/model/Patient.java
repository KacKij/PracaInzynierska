package pl.kijowski.przychodnialekarska.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstname;
    private String lastname;
    private String pesel;
    private String email;
    private String phoneNumber;
    private String phoneNumberExt;
    private LocalDate dateOfBirth;
    private String gender;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    private LocalDate lastVisitDate;
    private int lastVisitDoctor;

    // Optional audit fields:
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;


}
