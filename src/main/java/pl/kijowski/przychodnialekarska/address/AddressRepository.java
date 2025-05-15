package pl.kijowski.przychodnialekarska.address;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.kijowski.przychodnialekarska.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
}
