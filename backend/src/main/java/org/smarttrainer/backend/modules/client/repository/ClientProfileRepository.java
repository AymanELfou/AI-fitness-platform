package org.smarttrainer.backend.modules.client.repository;

import org.smarttrainer.backend.domain.client.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    Optional<ClientProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}