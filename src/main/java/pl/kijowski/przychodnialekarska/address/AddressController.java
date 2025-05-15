package pl.kijowski.przychodnialekarska.address;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.kijowski.przychodnialekarska.dto.AddressDto;
import pl.kijowski.przychodnialekarska.model.Address;
import pl.kijowski.przychodnialekarska.user.UserService;
import pl.kijowski.przychodnialekarska.util.JwtUtil;

import java.util.Optional;

@RestController
public class AddressController {

    private final UserService userService;
    private final AddressRepository addressRepository;
    private final JwtUtil jwtUtil;

    public AddressController(UserService userService, AddressRepository addressRepository, JwtUtil jwtUtil) {
        this.userService = userService;
        this.addressRepository = addressRepository;
        this.jwtUtil = jwtUtil;
    }

    @PutMapping("/api/dashboard/me/address")
    public ResponseEntity<?> updateAddress(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody AddressDto addressDto) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid auth");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        Address address = new Address(
                0,
                addressDto.getStreet(),
                addressDto.getCity(),
                addressDto.getZipCode(),
                addressDto.getState(),
                addressDto.getCountry(),
                addressDto.getStreetNumber(),
                addressDto.getApartmentNumber()
        );

        userService.updateAddressForUser(email, address);

        return ResponseEntity.ok("Address updated");
    }

    @GetMapping("/api/dashboard/me/address")
    public ResponseEntity<?> getCurrentUserAddress(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid auth");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        Optional<Address> addressOpt = userService.getUserAddress(email);

        if (addressOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found");
        }

        AddressDto dto = new AddressDto(addressOpt.get());
        return ResponseEntity.ok(dto);
    }
}
