package org.smarttrainer.backend.modules.community.repository;

import org.smarttrainer.backend.domain.community.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    Optional<Community> findByClubId(Long clubId);
    boolean existsByClubId(Long clubId);
}