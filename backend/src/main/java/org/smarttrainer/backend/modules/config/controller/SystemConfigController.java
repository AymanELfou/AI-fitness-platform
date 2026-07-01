package org.smarttrainer.backend.modules.config.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.config.SystemConfig;
import org.smarttrainer.backend.modules.config.service.SystemConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/config")
@RequiredArgsConstructor
public class SystemConfigController {

    private final SystemConfigService service;

    @GetMapping
    public ResponseEntity<SystemConfig> getConfig() {
        return ResponseEntity.ok(service.getConfig());
    }

    @PutMapping("maintenance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemConfig> updateMaintenanceMode(@RequestParam boolean enabled) {
        return ResponseEntity.ok(service.updateMaintenanceMode(enabled));
    }
}
