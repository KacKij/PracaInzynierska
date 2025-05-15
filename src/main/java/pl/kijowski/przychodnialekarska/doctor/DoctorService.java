package pl.kijowski.przychodnialekarska.doctor;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.kijowski.przychodnialekarska.dto.UserRegisterDto;
import pl.kijowski.przychodnialekarska.model.Role;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.role.RoleRepository;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<User> getAllDoctors() {
        return doctorRepository.findByRoles_Name("ROLE_DOCTOR");
    }

    public User createDoctor(UserRegisterDto dto, RoleRepository roleRepo, PasswordEncoder pwEncoder) {
        // 1) map the DTO → User
        User u = new User();
        u.setFirstname(dto.getFirstname());
        u.setLastname(dto.getLastname());
        u.setEmail(dto.getEmail());
        u.setUsername(dto.getUsername());
        u.setPassword(pwEncoder.encode(dto.getPassword()));
        u.setEnabled(true);
        u.setOccupation(dto.getOccupation());
        u.setPhoneNumberExt(dto.getPhone()); // adjust if your DTO splits ext/number
        // 2) assign ROLE_DOCTOR
        Role doctorRole = roleRepo.findByName("ROLE_DOCTOR");
        u.setRoles(List.of(doctorRole));
        // 3) save & return
        return doctorRepository.save(u);
    }

}
