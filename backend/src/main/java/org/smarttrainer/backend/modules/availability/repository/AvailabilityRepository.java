package org.smarttrainer.backend.modules.availability.repository;

import org.smarttrainer.backend.domain.availability.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByCoachId(Long coachId);
    List<Availability> findByCoachIdAndIsAvailable(Long coachId, boolean isAvailable);
}