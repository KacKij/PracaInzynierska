package pl.kijowski.przychodnialekarska.doctor;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.kijowski.przychodnialekarska.dto.UserRegisterDto;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.role.RoleRepository;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorController(DoctorService doctorService, DoctorRepository doctorRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SCHEDULER','ROLE_ADMIN')")
    public List<User> getDoctors() {
        // service runs findByRoles_Name("ROLE_DOCTOR") under the hood
        return doctorService.getAllDoctors();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SCHEDULER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> createDoctor(@RequestBody UserRegisterDto dto) {
        User created = doctorService.createDoctor(dto, roleRepository, passwordEncoder);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
