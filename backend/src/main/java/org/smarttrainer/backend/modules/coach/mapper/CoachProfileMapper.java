package org.smarttrainer.backend.modules.coach.mapper;

import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.modules.availability.dto.AvailabilityResponse;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileRequest;
import org.smarttrainer.backend.modules.coach.dto.CoachProfileResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CoachProfileMapper {

    public CoachProfileResponse toResponse(CoachProfile profile, Double rating){

        return CoachProfileResponse.builder()
                .id(profile.getId())
                .createdAt(profile.getCreatedAt())
                .userId(profile.getUser().getId())
                .email(profile.getUser().getEmail())
                .experience(profile.getExperience())
                .certifications(profile.getCertifications())
                .speciality(profile.getSpeciality())
                .tariff(profile.getTarif())
                .rating(rating)
                .clubId(profile.getClub() != null ? profile.getClub().getId() : null)
                .clubName(profile.getClub() != null ? profile.getClub().getClubName() : null)
                .availabilities(
                        profile.getAvailabilities() == null
                                ? List.of()
                                : profile.getAvailabilities().stream()
                                .map(a -> AvailabilityResponse.builder()
                                        .id(a.getId())
                                        .startTime(a.getStartTime())
                                        .endTime(a.getEndTime())
                                        .isAvailable(a.isAvailable())
                                        .build()
                                ).toList()
                ).userName(profile.getUser().fullName())
                .build();
    }

    public CoachProfile toEntity(CoachProfileRequest request){
        CoachProfile profile = new CoachProfile();

        profile.setExperience(request.getExperience());
        profile.setCertifications(request.getCertifications());
        profile.setSpeciality(request.getSpeciality());
        profile.setTarif(request.getTariff());

        return profile;
    }
}
