package pl.kijowski.przychodnialekarska.dto;

import lombok.Data;

@Data
public class UserRegisterDto {
    private String username;
    private String firstname;
    private String lastname;
    private String password;
    private String email;
    private String phone;
    private String occupation;
}
