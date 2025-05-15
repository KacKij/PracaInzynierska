package pl.kijowski.przychodnialekarska.user;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.kijowski.przychodnialekarska.address.AddressRepository;
import pl.kijowski.przychodnialekarska.dto.UserRegisterDto;
import pl.kijowski.przychodnialekarska.model.Address;
import pl.kijowski.przychodnialekarska.model.Role;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.privilege.PrivilegeRepository;
import pl.kijowski.przychodnialekarska.role.RoleRepository;

import java.util.List;
import java.util.Optional;

@Service("userService")
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    PrivilegeRepository privilegeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AddressRepository addressRepository;

    public User createUser(UserRegisterDto dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null) {
            throw new RuntimeException("Default role not found");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(true);
        user.setRoles(List.of(userRole));

        return userRepository.save(user);
    }

    public void updateAddressForUser(String email, Address newAddress) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address savedAddress = addressRepository.save(newAddress);

        user.setAddress(savedAddress);
        userRepository.save(user);
    }

    public Optional<Address> getUserAddress(String email) {
        return userRepository.findByEmail(email)
                .map(User::getAddress);
    }
}
