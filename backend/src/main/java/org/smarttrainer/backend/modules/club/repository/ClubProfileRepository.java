package org.smarttrainer.backend.modules.club.repository;

import org.smarttrainer.backend.domain.club.ClubProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubProfileRepository extends JpaRepository<ClubProfile,Long> {
}
