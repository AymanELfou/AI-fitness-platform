package org.smarttrainer.backend.modules.config.service;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.config.SystemConfig;
import org.smarttrainer.backend.modules.config.repository.SystemConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository repository;

    @Transactional(readOnly = true)
    public SystemConfig getConfig() {
        return repository.findAll().stream().findFirst().orElseGet(() -> {
            SystemConfig config = SystemConfig.builder()
                    .maintenanceMode(false)
                    .build();
            return repository.save(config);
        });
    }

    @Transactional
    public SystemConfig updateMaintenanceMode(boolean maintenanceMode) {
        SystemConfig config = getConfig();
        config.setMaintenanceMode(maintenanceMode);
        return repository.save(config);
    }
}
