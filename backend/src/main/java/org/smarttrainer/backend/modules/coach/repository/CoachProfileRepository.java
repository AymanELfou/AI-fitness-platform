package org.smarttrainer.backend.modules.coach.repository;

import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CoachProfileRepository extends JpaRepository<CoachProfile, Long> {

    Optional<CoachProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    @Query("SELECT AVG(r.score) FROM Review r WHERE r.coach.id = :coachId")
    Double getAverageRating(@org.springframework.data.repository.query.Param("coachId") Long coachId);
}