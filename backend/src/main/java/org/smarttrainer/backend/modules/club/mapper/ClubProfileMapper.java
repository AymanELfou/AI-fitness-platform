package org.smarttrainer.backend.modules.club.mapper;

import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.modules.club.dto.ClubProfileRequest;
import org.smarttrainer.backend.modules.club.dto.ClubProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class ClubProfileMapper {

    public ClubProfileResponse toResponse(ClubProfile profile) {
        return ClubProfileResponse.builder()
                .id(profile.getId())
                .createdAt(profile.getCreatedAt())
                .userId(profile.getUser().getId())
                .clubName(profile.getClubName())
                .localisation(profile.getLocalisation())
                .capacity(profile.getCapacity())
                .contactEmail(profile.getContactEmail())
                .phone(profile.getPhone())
                .build();
    }

    public ClubProfile toEntity(ClubProfileRequest request) {
        ClubProfile profile = new ClubProfile();
        profile.setClubName(request.getClubName());
        profile.setLocalisation(request.getLocalisation());
        profile.setCapacity(request.getCapacity());
        profile.setContactEmail(request.getContactEmail());
        profile.setPhone(request.getPhone());
        return profile;
    }
}