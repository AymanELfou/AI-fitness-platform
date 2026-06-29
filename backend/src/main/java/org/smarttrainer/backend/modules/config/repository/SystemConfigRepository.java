package org.smarttrainer.backend.modules.config.repository;

import org.smarttrainer.backend.domain.config.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
}
