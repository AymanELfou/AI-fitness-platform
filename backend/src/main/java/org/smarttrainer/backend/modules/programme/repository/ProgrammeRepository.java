package org.smarttrainer.backend.modules.programme.repository;

import org.smarttrainer.backend.domain.programme.Programme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgrammeRepository extends JpaRepository<Programme, Long> {
    List<Programme> findByCoachId(Long coachId);
    List<Programme> findByIsValidatedByCoachTrue();
    List<Programme> findByIsGeneratedByAITrue();
}