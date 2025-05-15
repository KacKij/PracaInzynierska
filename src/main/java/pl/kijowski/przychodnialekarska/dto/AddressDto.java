package pl.kijowski.przychodnialekarska.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.kijowski.przychodnialekarska.model.Address;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private String street;
    private String city;
    private String zipCode;
    private String state;
    private String country;
    private String streetNumber;
    private String apartmentNumber;

    public AddressDto(Address address) {
        this.street = address.getStreet();
        this.city = address.getCity();
        this.zipCode = address.getZipCode();
        this.state = address.getState();
        this.country = address.getCountry();
        this.streetNumber = address.getStreetNumber();
        this.apartmentNumber = address.getApartmentNumber();
    }
}
