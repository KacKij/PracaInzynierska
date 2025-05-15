package pl.kijowski.przychodnialekarska.doctorShiftSchedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.kijowski.przychodnialekarska.model.DoctorShiftSchedule;

import java.util.List;

@Repository
public interface DoctorShiftScheduleRepository extends JpaRepository<DoctorShiftSchedule,Long> {
    List<DoctorShiftSchedule> findByDoctor_Id(Long doctorId);
}