package pl.kijowski.przychodnialekarska.doctor;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.kijowski.przychodnialekarska.model.User;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<User, Integer> {

    List<User> findByRoles_Name(String roleName);
}
