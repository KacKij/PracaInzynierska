package pl.kijowski.przychodnialekarska.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.kijowski.przychodnialekarska.model.Privilege;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.model.Role;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private String firstname;
    private String lastname;
    private String email;
    private String occupation;
    private String phoneNumber;
    private List<String> roles;
    private List<String> privileges;

    public UserInfoDto(User user) {
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.email = user.getEmail();
        this.occupation = user.getOccupation();
        this.phoneNumber = user.getPhoneNumber();

        this.roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        this.privileges = user.getRoles().stream()
                .flatMap(role -> role.getPrivileges().stream())
                .map(Privilege::getName)
                .distinct()
                .collect(Collectors.toList());
    }

    // Getters and setters if needed
}
