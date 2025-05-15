package pl.kijowski.przychodnialekarska.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String street;
    private String city;
    @Column(name = "zip_code")
    private String zipCode;
    private String state;
    private String country;
    @Column(name = "street_number")
    private String streetNumber;
    @Column(name = "apartment_name")
    private String apartmentNumber;

}
