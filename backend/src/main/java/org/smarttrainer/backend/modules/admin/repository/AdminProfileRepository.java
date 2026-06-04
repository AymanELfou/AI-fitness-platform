package org.smarttrainer.backend.modules.admin.repository;

import org.smarttrainer.backend.domain.admin.AdminProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminProfileRepository extends JpaRepository<AdminProfile, Long> {
    Optional<AdminProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}