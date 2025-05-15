package pl.kijowski.przychodnialekarska.visit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.kijowski.przychodnialekarska.model.Visit;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByDoctor_IdAndVisitDateStartLessThanAndVisitDateEndGreaterThan(
            Long doctorId,
            LocalDateTime windowEnd,
            LocalDateTime windowStart
    );
}