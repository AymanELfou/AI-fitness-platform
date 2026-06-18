package org.smarttrainer.backend.modules.community.mapper;

import org.smarttrainer.backend.domain.community.Community;
import org.smarttrainer.backend.modules.community.dto.CommunityRequest;
import org.smarttrainer.backend.modules.community.dto.CommunityResponse;
import org.springframework.stereotype.Component;

@Component
public class CommunityMapper {

    public CommunityResponse toResponse(Community community) {
        return CommunityResponse.builder()
                .id(community.getId())
                .createdAt(community.getCreatedAt())
                .name(community.getName())
                .description(community.getDescription())
                .clubId(community.getClub().getId())
                .clubName(community.getClub().getClubName())
                .build();
    }

    public Community toEntity(CommunityRequest request) {
        Community community = new Community();
        community.setName(request.getName());
        community.setDescription(request.getDescription());
        return community;
    }
}