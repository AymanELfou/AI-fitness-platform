package org.smarttrainer.backend.modules.coach.mapper;

import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileRequest;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class CoachProfileMapper {

    public CoachProfileResponse toResponse(CoachProfile profile, Double rating){

        return CoachProfileResponse.builder()
                .id(profile.getId())
                .createdAt(profile.getCreatedAt())
                .experience(profile.getExperience())
                .certifications(profile.getCertifications())
                .speciality(profile.getSpeciality())
                .tariff(profile.getTariff())
                .rating(rating)
                .clubId(profile.getClub() != null ? profile.getClub().getId() : null)
                .clubName(profile.getClub() != null ? profile.getClub().getClubName() : null)
                .build();
    }

    public CoachProfile toEntity(CoachProfileRequest request){
        CoachProfile profile = new CoachProfile();

        profile.setExperience(request.getExperience());
        profile.setCertifications(request.getCertifications());
        profile.setSpeciality(request.getSpeciality());
        profile.setTariff(request.getTariff());

        return profile;
    }
}