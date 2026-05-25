package org.smarttrainer.backend.modules.coach.repository;

import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachProfileRepository extends JpaRepository<CoachProfile, Long> {
}
