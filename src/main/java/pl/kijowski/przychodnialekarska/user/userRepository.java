package pl.kijowski.przychodnialekarska.user;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.kijowski.przychodnialekarska.model.User;


public interface userRepository extends JpaRepository<User, Integer> {
}
