package org.smarttrainer.backend.modules.seance.repository;

import org.smarttrainer.backend.domain.seance.Seance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeanceRepository extends JpaRepository<Seance, Long> {
    List<Seance> findByCoachId(Long coachId);
    List<Seance> findByProgrammeId(Long programmeId);
    List<Seance> findByStatus(String status);
}