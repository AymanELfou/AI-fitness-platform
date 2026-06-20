package org.smarttrainer.backend.modules.progress.repository;

import org.smarttrainer.backend.domain.progress.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByClientId(Long clientId);
    List<Progress> findByClientIdOrderByCreatedAtAsc(Long clientId);
}