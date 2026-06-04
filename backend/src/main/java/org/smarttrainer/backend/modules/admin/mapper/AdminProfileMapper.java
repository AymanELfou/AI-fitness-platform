package org.smarttrainer.backend.modules.admin.mapper;

import org.smarttrainer.backend.domain.admin.AdminProfile;
import org.smarttrainer.backend.modules.admin.dto.AdminProfileRequest;
import org.smarttrainer.backend.modules.admin.dto.AdminProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class AdminProfileMapper {

    public AdminProfileResponse toResponse(AdminProfile profile) {
        return AdminProfileResponse.builder()
                .id(profile.getId())
                .createdAt(profile.getCreatedAt())
                .userId(profile.getUser().getId())
                .permissions(profile.getPermissions())
                .build();
    }

    public AdminProfile toEntity(AdminProfileRequest request) {
        AdminProfile profile = new AdminProfile();
        profile.setPermissions(request.getPermissions());
        return profile;
    }
}