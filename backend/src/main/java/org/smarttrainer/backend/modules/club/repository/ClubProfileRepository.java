package org.smarttrainer.backend.modules.club.repository;

import org.smarttrainer.backend.domain.club.ClubProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClubProfileRepository extends JpaRepository<ClubProfile, Long> {
    Optional<ClubProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}