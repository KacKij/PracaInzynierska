package pl.kijowski.przychodnialekarska.visit;

import org.springframework.stereotype.Service;
import pl.kijowski.przychodnialekarska.model.Visit;

import java.util.List;
import java.util.Optional;

@Service
public class VisitService {

    private final VisitRepository visitRepository;

    public VisitService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    public List<Visit> getAllVisits() {
        return visitRepository.findAll();
    }

    public Optional<Visit> getVisitById(Long id) {
        return visitRepository.findById(id);
    }

    public Visit saveVisit(Visit visit) {
        return visitRepository.save(visit);
    }

    public void deleteVisit(Long id) {
        visitRepository.deleteById(id);
    }
}