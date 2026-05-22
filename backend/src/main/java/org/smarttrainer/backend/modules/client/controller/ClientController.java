package org.smarttrainer.backend.modules.client.controller;

import lombok.RequiredArgsConstructor;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.modules.client.dto.ClientProfileRequest;
import org.smarttrainer.backend.modules.client.dto.ClientProfileResponse;
import org.smarttrainer.backend.modules.client.service.ClientProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientProfileService service;

    @PostMapping("{userId}/profile")
    @PreAuthorize("hasAuthority('ROLE_CLIENT')")
    public ResponseEntity<ClientProfileResponse> create(
            @PathVariable Long userId,
            @RequestBody ClientProfileRequest request){
        return ResponseEntity.ok(service.create(userId, request));
    }
}
