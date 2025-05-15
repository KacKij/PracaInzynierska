package pl.kijowski.przychodnialekarska.dto;

import lombok.Data;

@Data
public class PatientRegisterDto {
    private String firstname;
    private String lastname;
    private String email;
    private String phoneNumber;
    private String phoneNumberExt;
    private String pesel;
    private String gender;
    private String dateOfBirth;
    private AddressDto address;

    @Data
    public static class AddressDto {
        private String street;
        private String city;
        private String zipCode;
        private String state;
        private String country;
        private String streetNumber;
        private String apartmentNumber;
    }
}