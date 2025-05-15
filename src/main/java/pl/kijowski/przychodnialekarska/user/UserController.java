package pl.kijowski.przychodnialekarska.user;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.kijowski.przychodnialekarska.dto.LoginDto;
import pl.kijowski.przychodnialekarska.dto.UserInfoDto;
import pl.kijowski.przychodnialekarska.dto.UserRegisterDto;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.util.JwtUtil;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.*;


@RestController
@RequestMapping()
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("users")
    public List<User> getUsers() {
        return userRepository.findAll();

    }

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDto dto) {
        try {
            userService.createUser(dto);
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        Optional<User> userOpt = userRepository.findByEmail(loginDto.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }

    @GetMapping("/api/dashboard/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Auth at controller: " + authentication);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid auth");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }


        return ResponseEntity.ok(new UserInfoDto(userOpt.get()));
    }

}


